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
import { listGoogleCalendars } from "@/lib/google-calendar";

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

function refresh() {
  revalidatePath("/admin/calendar");
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
    return { error: "The calendar settings are not valid." };
  }
  const candidate = parseCalendarConfig({
    ...(submitted as Partial<CalendarConfig>),
    icalToken: current.icalToken,
    google: current.google,
  });
  if (!candidate) {
    return {
      error: "Check the meeting types, opening hours and booking limits.",
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
  const calendars = await listGoogleCalendars(current.google);
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

export async function disconnectGoogleCalendar() {
  await guard();
  const current = await readCalendarConfig();
  const withoutGoogle = { ...current };
  delete withoutGoogle.google;
  await writeCalendarConfig(withoutGoogle);
  refresh();
}
