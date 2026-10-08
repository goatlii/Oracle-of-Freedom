"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BOOKING_KINDS,
  BOOKING_STATUSES,
  isBooking,
  type Booking,
  type BookingKind,
  type BookingStatus,
} from "@/lib/bookings";
import { readBookings, writeBookings } from "@/lib/booking-store";
import { readCalendarConfig } from "@/lib/calendar-config-store";
import { deleteGoogleEvent, upsertGoogleEvent } from "@/lib/google-calendar";
import { isAdmin } from "@/lib/admin-auth";
import type { ActionState } from "@/app/admin/actions";

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value || "").trim().slice(0, max);
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
  revalidatePath("/book");
}

export async function saveBooking(_state: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const kind = clean(formData.get("kind"), 20);
  const status = clean(formData.get("status"), 20);
  if (!BOOKING_KINDS.includes(kind as BookingKind)) return { error: "Elige reunión, sesión o evento." };
  if (!BOOKING_STATUSES.includes(status as BookingStatus)) return { error: "Elige un estado." };

  const allDay = formData.get("allDay") === "on";
  const start = allDay ? "" : clean(formData.get("start"), 5);
  const end = allDay ? "" : clean(formData.get("end"), 5);
  const booking: Booking = {
    id: clean(formData.get("id"), 80) || randomUUID(),
    title: clean(formData.get("title"), 120),
    kind: kind as BookingKind,
    status: status as BookingStatus,
    date: clean(formData.get("date"), 10),
    allDay,
    start,
    end,
    place: clean(formData.get("place"), 160),
    client: clean(formData.get("client"), 120),
    contact: clean(formData.get("contact"), 160),
    notes: clean(formData.get("notes"), 2000),
  };

  if (!booking.title) return { error: "Escribe un título." };
  if (!isBooking(booking)) return { error: "Revisa la fecha y las horas." };
  if (!allDay && end <= start) return { error: "La hora final tiene que ser posterior a la de inicio." };

  const current = await readBookings();
  const previous = current.find((item) => item.id === booking.id);
  booking.origin = previous?.origin || "studio";
  booking.bookingTypeId = previous?.bookingTypeId;
  booking.locale = previous?.locale;
  booking.publicToken = previous?.publicToken;
  booking.googleEventId = previous?.googleEventId;
  if (current.length >= 1000 && !current.some((item) => item.id === booking.id)) {
    return { error: "La agenda está llena. Borra una cita antigua." };
  }
  const exists = current.some((item) => item.id === booking.id);
  if (clean(formData.get("id"), 80) && !exists) return { error: "Esa cita ya no está en la agenda." };
  const next = exists ? current.map((item) => (item.id === booking.id ? booking : item)) : [booking, ...current];

  try {
    await writeBookings(next);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "No se pudo guardar la cita.",
    };
  }
  try {
    const config = await readCalendarConfig();
    if (booking.status === "cancelled" && booking.googleEventId) {
      await deleteGoogleEvent(config, booking);
    } else {
      const synced = await upsertGoogleEvent(config, booking);
      if (synced.googleEventId !== booking.googleEventId) {
        await writeBookings(next.map((item) => (item.id === synced.id ? synced : item)));
      }
    }
  } catch (error) {
    refresh();
    return {
      error:
        error instanceof Error
          ? `Guardada en el estudio. Google no se actualizó: ${error.message}`
          : "No se pudo guardar la cita.",
    };
  }
  refresh();
  return { ok: true };
}

export async function deleteBooking(formData: FormData) {
  await guard();
  const id = clean(formData.get("id"), 80);
  if (!id) return;
  const current = await readBookings();
  const booking = current.find((item) => item.id === id);
  if (booking) {
    try {
      await deleteGoogleEvent(await readCalendarConfig(), booking);
    } catch (error) {
      console.error("[calendar] Google event deletion failed", error);
    }
  }
  await writeBookings(current.filter((item) => item.id !== id));
  refresh();
}
