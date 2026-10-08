import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { Booking } from "@/lib/bookings";
import type { CalendarConfig, GoogleConnection } from "@/lib/calendar-config";
import { CALENDAR_TIME_ZONE } from "@/lib/calendar-config";
import type { BusyInterval } from "@/lib/availability";
import { lisbonDateTimeToUtc, utcToLisbonDateTime } from "@/lib/availability";
import { siteUrl } from "@/lib/content";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const API_URL = "https://www.googleapis.com/calendar/v3";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
  "https://www.googleapis.com/auth/calendar.freebusy",
].join(" ");

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
};

export type GoogleCalendarOption = {
  id: string;
  summary: string;
  primary: boolean;
};

type GoogleEvent = {
  id?: string;
  status?: string;
  summary?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
};

function encryptionSecret() {
  return process.env.GOOGLE_TOKEN_ENCRYPTION_KEY || process.env.ADMIN_PASSWORD || "";
}

function encryptionKey() {
  const secret = encryptionSecret();
  if (!secret) throw new Error("Add GOOGLE_TOKEN_ENCRYPTION_KEY before connecting Google Calendar.");
  return createHash("sha256").update(secret).digest();
}

export function encryptGoogleToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((value) => value.toString("base64url")).join(".");
}

function decryptGoogleToken(value: string) {
  const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  if (!iv || !tag || !encrypted) throw new Error("The saved Google connection is invalid.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function googleOAuthConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      encryptionSecret(),
  );
}

export function googleRedirectUri() {
  return (
    process.env.GOOGLE_REDIRECT_URI ||
    `${siteUrl()}/api/admin/google/callback`
  );
}

export function googleAuthorizationUrl(state: string) {
  if (!googleOAuthConfigured()) {
    throw new Error("Google Calendar credentials are not configured.");
  }
  const query = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    scope: SCOPES,
    state,
  });
  return `${AUTH_URL}?${query}`;
}

async function tokenRequest(body: URLSearchParams) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const result = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !result.access_token) {
    throw new Error(`Google authorization failed (${result.error || response.status}).`);
  }
  return result;
}

export async function exchangeGoogleCode(code: string) {
  return tokenRequest(
    new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: googleRedirectUri(),
      grant_type: "authorization_code",
    }),
  );
}

async function accessToken(connection: GoogleConnection) {
  const result = await tokenRequest(
    new URLSearchParams({
      refresh_token: decryptGoogleToken(connection.encryptedRefreshToken),
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      grant_type: "refresh_token",
    }),
  );
  return result.access_token!;
}

async function googleFetch<T>(
  access: string,
  path: string,
  init?: RequestInit,
  accepted: number[] = [],
): Promise<{ status: number; data?: T }> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${access}`,
      "content-type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (accepted.includes(response.status)) return { status: response.status };
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Calendar returned ${response.status}: ${body.slice(0, 240)}`);
  }
  if (response.status === 204) return { status: response.status };
  return { status: response.status, data: (await response.json()) as T };
}

export async function listGoogleCalendars(connection: GoogleConnection) {
  const access = await accessToken(connection);
  const result = await googleFetch<{
    items?: Array<{ id?: string; summary?: string; primary?: boolean; accessRole?: string }>;
  }>(access, "/users/me/calendarList?minAccessRole=writer&showHidden=false");
  return (result.data?.items || [])
    .filter((item) => item.id && item.summary)
    .map((item) => ({
      id: item.id!,
      summary: item.summary!,
      primary: item.primary === true,
    }));
}

export async function initialGoogleConnection(refreshToken: string, access: string) {
  const calendars = await googleFetch<{
    items?: Array<{ id?: string; summary?: string; primary?: boolean; accessRole?: string }>;
  }>(access, "/users/me/calendarList?minAccessRole=writer&showHidden=false");
  const writable = (calendars.data?.items || []).filter((item) => item.id && item.summary);
  const selected = writable.find((item) => item.primary) || writable[0];
  if (!selected?.id) throw new Error("No writable Google calendar was found.");
  return {
    encryptedRefreshToken: encryptGoogleToken(refreshToken),
    calendarId: selected.id,
    calendarSummary: selected.summary || "Google Calendar",
    accountEmail: selected.id.includes("@") ? selected.id : "",
    connectedAt: new Date().toISOString(),
  } satisfies GoogleConnection;
}

export async function googleBusy(
  config: CalendarConfig,
  from: Date,
  to: Date,
): Promise<BusyInterval[]> {
  if (!config.google || !googleOAuthConfigured()) return [];
  const access = await accessToken(config.google);
  const result = await googleFetch<{
    calendars?: Record<string, { busy?: BusyInterval[] }>;
  }>(access, "/freeBusy", {
    method: "POST",
    body: JSON.stringify({
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      timeZone: CALENDAR_TIME_ZONE,
      items: [{ id: config.google.calendarId }],
    }),
  });
  return result.data?.calendars?.[config.google.calendarId]?.busy || [];
}

function eventBody(booking: Booking) {
  const nextDate = new Date(`${booking.date}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const description = [
    booking.origin === "web" ? "Booked through oracleoffreedom.com" : "Created in Oracle of Freedom Studio",
    booking.client ? `With: ${booking.client}` : "",
    booking.contact ? `Contact: ${booking.contact}` : "",
    booking.notes,
  ]
    .filter(Boolean)
    .join("\n");
  return {
    summary: booking.title,
    description,
    location: booking.place || undefined,
    status: booking.status === "cancelled" ? "cancelled" : "confirmed",
    start: booking.allDay
      ? { date: booking.date }
      : {
          dateTime: lisbonDateTimeToUtc(booking.date, booking.start).toISOString(),
          timeZone: CALENDAR_TIME_ZONE,
        },
    end: booking.allDay
      ? {
          date: nextDate.toISOString().slice(0, 10),
        }
      : {
          dateTime: lisbonDateTimeToUtc(booking.date, booking.end).toISOString(),
          timeZone: CALENDAR_TIME_ZONE,
        },
    extendedProperties: { private: { oracleBookingId: booking.id } },
  };
}

export async function upsertGoogleEvent(config: CalendarConfig, booking: Booking) {
  if (!config.google || !googleOAuthConfigured()) return booking;
  const access = await accessToken(config.google);
  const calendar = encodeURIComponent(config.google.calendarId);
  const result = await googleFetch<GoogleEvent>(
    access,
    booking.googleEventId
      ? `/calendars/${calendar}/events/${encodeURIComponent(booking.googleEventId)}?sendUpdates=none`
      : `/calendars/${calendar}/events?sendUpdates=none`,
    {
      method: booking.googleEventId ? "PUT" : "POST",
      body: JSON.stringify(eventBody(booking)),
    },
  );
  return result.data?.id ? { ...booking, googleEventId: result.data.id } : booking;
}

export async function deleteGoogleEvent(config: CalendarConfig, booking: Booking) {
  if (!config.google || !booking.googleEventId || !googleOAuthConfigured()) return;
  const access = await accessToken(config.google);
  await googleFetch(
    access,
    `/calendars/${encodeURIComponent(config.google.calendarId)}/events/${encodeURIComponent(booking.googleEventId)}?sendUpdates=none`,
    { method: "DELETE" },
    [404, 410],
  );
}

export async function syncLinkedGoogleBookings(
  config: CalendarConfig,
  bookings: Booking[],
  from: string,
  to: string,
) {
  if (!config.google || !googleOAuthConfigured()) return { bookings, changed: false };
  const candidates = bookings.filter(
    (booking) =>
      booking.googleEventId &&
      booking.status !== "cancelled" &&
      booking.date >= from &&
      booking.date <= to,
  );
  if (candidates.length === 0) return { bookings, changed: false };
  const access = await accessToken(config.google);
  const calendar = encodeURIComponent(config.google.calendarId);
  let changed = false;
  const updates = new Map<string, Booking>();

  await Promise.all(
    candidates.map(async (booking) => {
      const result = await googleFetch<GoogleEvent>(
        access,
        `/calendars/${calendar}/events/${encodeURIComponent(booking.googleEventId!)}`,
        undefined,
        [404, 410],
      );
      if (result.status === 404 || result.status === 410 || result.data?.status === "cancelled") {
        updates.set(booking.id, { ...booking, status: "cancelled" });
        changed = true;
        return;
      }
      const event = result.data;
      if (!event?.start || !event.end) return;
      const allDay = Boolean(event.start.date);
      const start = allDay
        ? { date: event.start.date!, time: "" }
        : utcToLisbonDateTime(event.start.dateTime!);
      const end = allDay
        ? { date: event.end.date!, time: "" }
        : utcToLisbonDateTime(event.end.dateTime!);
      const next: Booking = {
        ...booking,
        title: event.summary || booking.title,
        date: start.date,
        allDay,
        start: start.time,
        end: end.time,
      };
      if (
        next.title !== booking.title ||
        next.date !== booking.date ||
        next.allDay !== booking.allDay ||
        next.start !== booking.start ||
        next.end !== booking.end
      ) {
        updates.set(booking.id, next);
        changed = true;
      }
    }),
  );

  return {
    bookings: changed
      ? bookings.map((booking) => updates.get(booking.id) || booking)
      : bookings,
    changed,
  };
}
