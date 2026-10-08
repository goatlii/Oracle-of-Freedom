export const BOOKING_KINDS = ["meeting", "session", "event"] as const;
export const BOOKING_STATUSES = ["hold", "confirmed", "done", "cancelled"] as const;

export type BookingKind = (typeof BOOKING_KINDS)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type BookingOrigin = "studio" | "web";

export type Booking = {
  id: string;
  title: string;
  kind: BookingKind;
  status: BookingStatus;
  date: string;
  allDay: boolean;
  start: string;
  end: string;
  place: string;
  client: string;
  contact: string;
  notes: string;
  origin?: BookingOrigin;
  bookingTypeId?: string;
  locale?: "en" | "es" | "pt";
  publicToken?: string;
  googleEventId?: string;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export const kindLabel: Record<BookingKind, string> = {
  meeting: "Meeting",
  session: "Session",
  event: "Event",
};

export const statusLabel: Record<BookingStatus, string> = {
  hold: "Hold",
  confirmed: "Confirmed",
  done: "Done",
  cancelled: "Cancelled",
};

export function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Booking>;
  const timed = item.allDay !== true;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    item.id.length <= 80 &&
    typeof item.title === "string" &&
    item.title.length > 0 &&
    item.title.length <= 120 &&
    BOOKING_KINDS.includes(item.kind as BookingKind) &&
    BOOKING_STATUSES.includes(item.status as BookingStatus) &&
    typeof item.date === "string" &&
    DATE.test(item.date) &&
    typeof item.allDay === "boolean" &&
    typeof item.start === "string" &&
    (!timed || TIME.test(item.start)) &&
    typeof item.end === "string" &&
    (!timed || TIME.test(item.end)) &&
    typeof item.place === "string" &&
    item.place.length <= 160 &&
    typeof item.client === "string" &&
    item.client.length <= 120 &&
    typeof item.contact === "string" &&
    item.contact.length <= 160 &&
    typeof item.notes === "string" &&
    item.notes.length <= 2000 &&
    (item.origin === undefined || item.origin === "studio" || item.origin === "web") &&
    (item.bookingTypeId === undefined ||
      (typeof item.bookingTypeId === "string" && item.bookingTypeId.length <= 60)) &&
    (item.locale === undefined || item.locale === "en" || item.locale === "es" || item.locale === "pt") &&
    (item.publicToken === undefined ||
      (typeof item.publicToken === "string" && item.publicToken.length <= 100)) &&
    (item.googleEventId === undefined ||
      (typeof item.googleEventId === "string" && item.googleEventId.length <= 200))
  );
}

export function parseMonth(value: string | undefined, fallback: string) {
  return value && MONTH.test(value) ? value : fallback;
}

export function shiftMonth(key: string, delta: number) {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("es", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function dayLabel(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function shiftDate(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day));
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function weekOf(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start);
    next.setUTCDate(start.getUTCDate() + index);
    return next.toISOString().slice(0, 10);
  });
}

export function monthGrid(key: string) {
  const [year, month] = key.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const start = new Date(first);
  start.setUTCDate(1 - lead);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const iso = date.toISOString().slice(0, 10);
    return { date: iso, inMonth: iso.startsWith(key) };
  });
}

export function overlaps(a: Booking, b: Booking) {
  if (a.id === b.id || a.date !== b.date) return false;
  if (a.status === "cancelled" || b.status === "cancelled") return false;
  if (a.status === "done" || b.status === "done") return false;
  if (a.allDay || b.allDay) return true;
  return a.start < b.end && b.start < a.end;
}

export function sortBookings(bookings: Booking[]) {
  return [...bookings].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      Number(b.allDay) - Number(a.allDay) ||
      a.start.localeCompare(b.start) ||
      a.title.localeCompare(b.title),
  );
}
