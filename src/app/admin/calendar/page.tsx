import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { CalendarBoard } from "@/components/calendar-board";
import { CalendarSettings } from "@/components/calendar-settings";
import { isAdmin } from "@/lib/admin-auth";
import { parseMonth } from "@/lib/bookings";
import { readBookings, writeBookings } from "@/lib/booking-store";
import { readCalendarConfig } from "@/lib/calendar-config-store";
import {
  googleAppFromConfig,
  listGoogleCalendars,
  suggestedGoogleRedirectUri,
  syncLinkedGoogleBookings,
  type GoogleCalendarOption,
} from "@/lib/google-calendar";
import { siteUrl } from "@/lib/content";
import { lisbonToday } from "@/lib/pricing";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; google?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { month: requested, google: googleResult } = await searchParams;
  const today = lisbonToday();
  const month = parseMonth(requested, today.slice(0, 7));
  const config = await readCalendarConfig();
  let bookings = await readBookings();
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  try {
    const synced = await syncLinkedGoogleBookings(
      config,
      bookings,
      `${month}-01`,
      `${month}-${String(lastDay).padStart(2, "0")}`,
    );
    bookings = synced.bookings;
    if (synced.changed) await writeBookings(bookings);
  } catch (error) {
    console.error("[calendar] Google event sync failed", error);
  }
  let googleCalendars: GoogleCalendarOption[] = [];
  const googleApp = googleAppFromConfig(config);
  if (config.google && googleApp) {
    try {
      googleCalendars = await listGoogleCalendars(config);
    } catch (error) {
      console.error("[calendar] Google calendar list failed", error);
    }
  }
  const publicSettings = {
    bookingTypes: config.bookingTypes,
    weekly: config.weekly,
    daysAhead: config.daysAhead,
    minimumNoticeHours: config.minimumNoticeHours,
    bufferMinutes: config.bufferMinutes,
    defaultLocation: config.defaultLocation,
  };
  const googleNotice =
    googleResult === "connected"
      ? "Google Calendar connected."
      : googleResult === "missing"
        ? "Press Start and paste the Client ID and Client secret."
        : googleResult === "error"
          ? "Google Calendar could not be connected. Check the OAuth settings and try again."
          : undefined;
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <AdminHeader current="calendar" title="Calendar" />
      <CalendarBoard bookings={bookings} today={today} month={month} mode={storageMode()} />
      <CalendarSettings
        initial={publicSettings}
        mode={storageMode()}
        feedUrl={`${siteUrl()}/api/calendar/feed?token=${config.icalToken}`}
        redirectUri={config.googleApp?.redirectUri || suggestedGoogleRedirectUri()}
        savedClientId={config.googleApp?.clientId || ""}
        secretSaved={Boolean(config.googleApp?.encryptedClientSecret)}
        googleConfigured={Boolean(googleApp)}
        googleConnected={Boolean(config.google)}
        googleCalendarId={config.google?.calendarId || ""}
        googleSummary={config.google?.calendarSummary || ""}
        googleAccount={config.google?.accountEmail || ""}
        googleCalendars={googleCalendars}
        googleNotice={googleNotice}
      />
    </main>
  );
}
