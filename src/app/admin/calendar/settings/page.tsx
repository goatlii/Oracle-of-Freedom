import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { CalendarSettings } from "@/components/calendar-settings";
import { isAdmin } from "@/lib/admin-auth";
import { readCalendarConfig } from "@/lib/calendar-config-store";
import { siteUrl } from "@/lib/content";
import {
  googleAppFromConfig,
  listGoogleCalendars,
  suggestedGoogleRedirectUri,
  type GoogleCalendarOption,
} from "@/lib/google-calendar";
import { storageMode } from "@/lib/store";
import { studioCopy } from "@/lib/studio-copy";
import { studioLang } from "@/lib/studio-locale.server";

export const dynamic = "force-dynamic";

export default async function CalendarSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const t = studioCopy(await studioLang());
  const { google: googleResult } = await searchParams;
  const config = await readCalendarConfig();
  let googleCalendars: GoogleCalendarOption[] = [];
  const googleApp = googleAppFromConfig(config);
  if (config.google && googleApp) {
    try {
      googleCalendars = await listGoogleCalendars(config);
    } catch (error) {
      console.error("[calendar] Google calendar list failed", error);
    }
  }
  const googleNotice =
    googleResult === "connected"
      ? t.settings.googleConnected
      : googleResult === "missing"
        ? t.settings.googleMissing
        : googleResult === "error"
          ? t.settings.googleError
          : undefined;

  return (
    <main className="studio-page mx-auto max-w-6xl px-4 py-4 md:py-12">
      <AdminHeader current="calendar" title={t.settings.title} />
      <p className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href="/admin/calendar" className="underline underline-offset-4">
          {t.settings.back}
        </Link>
        <Link href="/" className="underline underline-offset-4">
          {t.settings.viewSite}
        </Link>
      </p>
      <CalendarSettings
        initial={{
          bookingTypes: config.bookingTypes,
          weekly: config.weekly,
          daysAhead: config.daysAhead,
          minimumNoticeHours: config.minimumNoticeHours,
          bufferMinutes: config.bufferMinutes,
          defaultLocation: config.defaultLocation,
        }}
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
