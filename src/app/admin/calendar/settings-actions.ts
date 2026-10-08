"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import { isAdmin } from "@/lib/admin-auth";
import {
  newCalendarToken,
  parseCalendarConfig,
  type CalendarConfig,
} from "@/lib/calendar-config";
import {
  readCalendarConfig,
  writeCalendarConfig,
} from "@/lib/calendar-config-store";
import { encryptGoogleToken, listGoogleCalendars } from "@/lib/google-calendar";

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value || "").trim().slice(0, max);
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/calendar/settings");
  revalidatePath("/book");
  revalidatePath("/es/reservar");
  revalidatePath("/pt/reservar");
}

export async function saveCalendarSettings(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await guard();
  const current = await readCalendarConfig();
  let submitted: unknown;
  try {
    submitted = JSON.parse(String(formData.get("settings") || ""));
  } catch {
    return { error: "Estos ajustes de la agenda no son válidos." };
  }
  const candidate = parseCalendarConfig({
    ...(submitted as Partial<CalendarConfig>),
    icalToken: current.icalToken,
    google: current.google,
    googleApp: current.googleApp,
  });
  if (!candidate) {
    return {
      error: "Revisa los tipos de cita, el horario y los límites de reserva.",
    };
  }
  try {
    await writeCalendarConfig(candidate);
    refresh();
    return { ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "The settings did not save.",
    };
  }
}

export async function regenerateIcalToken() {
  await guard();
  const current = await readCalendarConfig();
  await writeCalendarConfig({ ...current, icalToken: newCalendarToken() });
  refresh();
}

export async function selectGoogleCalendar(formData: FormData) {
  await guard();
  const current = await readCalendarConfig();
  if (!current.google) return;
  const id = String(formData.get("calendarId") || "").slice(0, 500);
  if (!id) return;
  const calendars = await listGoogleCalendars(current);
  const selected = calendars.find((calendar) => calendar.id === id);
  if (!selected) return;
  await writeCalendarConfig({
    ...current,
    google: {
      ...current.google,
      calendarId: id,
      calendarSummary: selected.summary,
    },
  });
  refresh();
}

export async function saveGoogleAppSettings(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await guard();
  const clientId = clean(formData.get("clientId"), 200);
  const clientSecret = String(formData.get("clientSecret") || "").trim().slice(0, 300);
  const redirectUri = clean(formData.get("redirectUri"), 300);
  if (!/^[A-Za-z0-9._-]{8,200}$/.test(clientId)) {
    return { error: "Pega el Client ID de Google Cloud en la casilla Client ID." };
  }
  let redirect: URL;
  try {
    redirect = new URL(redirectUri);
  } catch {
    return { error: "La dirección de vuelta tiene que ser una dirección web completa." };
  }
  const local = redirect.hostname === "localhost";
  if (
    (redirect.protocol !== "https:" && !(local && redirect.protocol === "http:")) ||
    redirect.pathname !== "/api/admin/google/callback"
  ) {
    return { error: "La dirección de vuelta tiene que terminar en /api/admin/google/callback." };
  }
  const current = await readCalendarConfig();
  let encrypted = current.googleApp?.encryptedClientSecret || "";
  if (clientSecret) {
    try {
      encrypted = encryptGoogleToken(clientSecret);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "No se pudo guardar el Client secret.",
      };
    }
  }
  if (!encrypted) return { error: "Pega el Client secret de Google Cloud en la casilla Client secret." };
  try {
    await writeCalendarConfig({
      ...current,
      googleApp: { clientId, encryptedClientSecret: encrypted, redirectUri },
    });
    refresh();
    return { ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "No se guardó la configuración de Google.",
    };
  }
}

export async function disconnectGoogleCalendar() {
  await guard();
  const current = await readCalendarConfig();
  const withoutGoogle = { ...current };
  delete withoutGoogle.google;
  await writeCalendarConfig(withoutGoogle);
  refresh();
}
