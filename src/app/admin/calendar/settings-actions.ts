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
    googleApp: current.googleApp,
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
    return { error: "Paste the Client ID from Google Cloud into the Client ID box." };
  }
  let redirect: URL;
  try {
    redirect = new URL(redirectUri);
  } catch {
    return { error: "The redirect address needs to be a full web address." };
  }
  const local = redirect.hostname === "localhost";
  if (
    (redirect.protocol !== "https:" && !(local && redirect.protocol === "http:")) ||
    redirect.pathname !== "/api/admin/google/callback"
  ) {
    return { error: "The redirect address must end with /api/admin/google/callback." };
  }
  const current = await readCalendarConfig();
  let encrypted = current.googleApp?.encryptedClientSecret || "";
  if (clientSecret) {
    try {
      encrypted = encryptGoogleToken(clientSecret);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "The Client secret could not be saved.",
      };
    }
  }
  if (!encrypted) return { error: "Paste the Client secret from Google Cloud into the Client secret box." };
  try {
    await writeCalendarConfig({
      ...current,
      googleApp: { clientId, encryptedClientSecret: encrypted, redirectUri },
    });
    refresh();
    return { ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "The Google setup did not save.",
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
