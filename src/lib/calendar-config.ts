import { randomBytes } from "node:crypto";
import type { BookingKind } from "@/lib/bookings";
import type { Locale } from "@/i18n/routing";

export const CALENDAR_TIME_ZONE = "Europe/Lisbon";

export type LocalizedLabel = Record<Locale, string>;

export type PublicBookingType = {
  id: string;
  label: LocalizedLabel;
  description: LocalizedLabel;
  durationMinutes: number;
  kind: BookingKind;
  active: boolean;
};

export type DaySchedule = {
  enabled: boolean;
  start: string;
  end: string;
};

export type GoogleConnection = {
  encryptedRefreshToken: string;
  calendarId: string;
  calendarSummary: string;
  accountEmail: string;
  connectedAt: string;
};

export type CalendarConfig = {
  bookingTypes: PublicBookingType[];
  weekly: Record<string, DaySchedule>;
  daysAhead: number;
  minimumNoticeHours: number;
  bufferMinutes: number;
  defaultLocation: string;
  icalToken: string;
  google?: GoogleConnection;
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export function newCalendarToken() {
  return randomBytes(24).toString("base64url");
}

export function defaultCalendarConfig(): CalendarConfig {
  return {
    bookingTypes: [
      {
        id: "intro-call",
        label: {
          en: "Meet Agota",
          es: "Conoce a Agota",
          pt: "Conhece a Agota",
        },
        description: {
          en: "A relaxed video call to talk through your idea.",
          es: "Una videollamada tranquila para hablar de tu idea.",
          pt: "Uma videochamada tranquila para falar da tua ideia.",
        },
        durationMinutes: 30,
        kind: "meeting",
        active: true,
      },
      {
        id: "planning-call",
        label: {
          en: "Planning session",
          es: "Sesión de planificación",
          pt: "Sessão de planeamento",
        },
        description: {
          en: "One hour to shape a shoot, event or collaboration.",
          es: "Una hora para preparar una sesión, evento o colaboración.",
          pt: "Uma hora para preparar uma sessão, evento ou colaboração.",
        },
        durationMinutes: 60,
        kind: "session",
        active: true,
      },
    ],
    weekly: {
      "0": { enabled: false, start: "10:00", end: "18:00" },
      "1": { enabled: false, start: "10:00", end: "18:00" },
      "2": { enabled: true, start: "10:00", end: "18:00" },
      "3": { enabled: true, start: "10:00", end: "18:00" },
      "4": { enabled: true, start: "10:00", end: "18:00" },
      "5": { enabled: true, start: "10:00", end: "18:00" },
      "6": { enabled: true, start: "10:00", end: "18:00" },
    },
    daysAhead: 60,
    minimumNoticeHours: 24,
    bufferMinutes: 15,
    defaultLocation: "Video call",
    icalToken: newCalendarToken(),
  };
}

function validLocalized(value: unknown): value is LocalizedLabel {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<LocalizedLabel>;
  return ["en", "es", "pt"].every(
    (locale) => typeof item[locale as Locale] === "string" && item[locale as Locale]!.trim().length > 0,
  );
}

function validBookingType(value: unknown): value is PublicBookingType {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PublicBookingType>;
  return (
    typeof item.id === "string" &&
    /^[a-z0-9-]{1,60}$/.test(item.id) &&
    validLocalized(item.label) &&
    validLocalized(item.description) &&
    Number.isInteger(item.durationMinutes) &&
    (item.durationMinutes ?? 0) >= 15 &&
    (item.durationMinutes ?? 0) <= 480 &&
    (item.kind === "meeting" || item.kind === "session" || item.kind === "event") &&
    typeof item.active === "boolean"
  );
}

function validDay(value: unknown): value is DaySchedule {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<DaySchedule>;
  return (
    typeof item.enabled === "boolean" &&
    typeof item.start === "string" &&
    typeof item.end === "string" &&
    timePattern.test(item.start) &&
    timePattern.test(item.end) &&
    item.end > item.start
  );
}

export function parseCalendarConfig(value: unknown): CalendarConfig | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<CalendarConfig>;
  if (
    !Array.isArray(item.bookingTypes) ||
    item.bookingTypes.length === 0 ||
    item.bookingTypes.length > 12 ||
    !item.bookingTypes.every(validBookingType) ||
    !item.weekly ||
    !Array.from({ length: 7 }, (_, day) => String(day)).every((day) => validDay(item.weekly?.[day])) ||
    !Number.isInteger(item.daysAhead) ||
    (item.daysAhead ?? 0) < 1 ||
    (item.daysAhead ?? 0) > 365 ||
    !Number.isInteger(item.minimumNoticeHours) ||
    (item.minimumNoticeHours ?? 0) < 0 ||
    (item.minimumNoticeHours ?? 0) > 720 ||
    !Number.isInteger(item.bufferMinutes) ||
    (item.bufferMinutes ?? 0) < 0 ||
    (item.bufferMinutes ?? 0) > 180 ||
    typeof item.defaultLocation !== "string" ||
    item.defaultLocation.length > 160 ||
    typeof item.icalToken !== "string" ||
    item.icalToken.length < 20
  ) {
    return null;
  }
  return item as CalendarConfig;
}
