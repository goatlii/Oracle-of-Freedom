import { CALENDAR_TIME_ZONE, type CalendarConfig, type PublicBookingType } from "@/lib/calendar-config";
import type { Booking } from "@/lib/bookings";

export type BusyInterval = { start: string; end: string };
export type AvailableSlot = {
  date: string;
  start: string;
  end: string;
  startsAt: string;
  endsAt: string;
};

function partsInLisbon(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CALENDAR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
    second: value("second"),
  };
}

export function lisbonDateTimeToUtc(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const desired = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidate = new Date(desired);
  for (let pass = 0; pass < 3; pass += 1) {
    const local = partsInLisbon(candidate);
    const represented = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second,
    );
    candidate = new Date(candidate.getTime() + desired - represented);
  }
  return candidate;
}

export function utcToLisbonDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const local = partsInLisbon(date);
  return {
    date: `${local.year}-${String(local.month).padStart(2, "0")}-${String(local.day).padStart(2, "0")}`,
    time: `${String(local.hour).padStart(2, "0")}:${String(local.minute).padStart(2, "0")}`,
  };
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + days));
  return value.toISOString().slice(0, 10);
}

function minutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function asTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function interval(start: Date, end: Date) {
  return { start: start.getTime(), end: end.getTime() };
}

function collides(
  candidate: { start: number; end: number },
  busy: { start: number; end: number }[],
  bufferMinutes: number,
) {
  const buffer = bufferMinutes * 60_000;
  return busy.some((item) => candidate.start < item.end + buffer && item.start - buffer < candidate.end);
}

export function activeBookingType(config: CalendarConfig, id: string): PublicBookingType | undefined {
  return config.bookingTypes.find((item) => item.id === id && item.active);
}

export function availabilityRange(today: string, daysAhead: number) {
  return {
    from: today,
    to: addDays(today, daysAhead),
  };
}

export function buildAvailability({
  config,
  bookingType,
  bookings,
  externalBusy,
  today,
  now = new Date(),
  limitDays = 35,
}: {
  config: CalendarConfig;
  bookingType: PublicBookingType;
  bookings: Booking[];
  externalBusy: BusyInterval[];
  today: string;
  now?: Date;
  limitDays?: number;
}): AvailableSlot[] {
  const lastOffset = Math.min(config.daysAhead, Math.max(1, limitDays));
  const earliest = now.getTime() + config.minimumNoticeHours * 60 * 60_000;
  const bookingBusy = bookings
    .filter((item) => item.status !== "cancelled" && item.status !== "done")
    .map((item) => {
      if (item.allDay) {
        return interval(
          lisbonDateTimeToUtc(item.date, "00:00"),
          lisbonDateTimeToUtc(addDays(item.date, 1), "00:00"),
        );
      }
      return interval(
        lisbonDateTimeToUtc(item.date, item.start),
        lisbonDateTimeToUtc(item.date, item.end),
      );
    });
  const googleBusy = externalBusy
    .map((item) => interval(new Date(item.start), new Date(item.end)))
    .filter((item) => Number.isFinite(item.start) && Number.isFinite(item.end));
  const busy = [...bookingBusy, ...googleBusy];
  const slots: AvailableSlot[] = [];

  for (let offset = 0; offset <= lastOffset; offset += 1) {
    const date = addDays(today, offset);
    const [year, month, day] = date.split("-").map(Number);
    const schedule = config.weekly[String(new Date(Date.UTC(year, month - 1, day)).getUTCDay())];
    if (!schedule?.enabled) continue;
    const opens = minutes(schedule.start);
    const closes = minutes(schedule.end);
    for (
      let cursor = opens;
      cursor + bookingType.durationMinutes <= closes;
      cursor += 15
    ) {
      const start = asTime(cursor);
      const end = asTime(cursor + bookingType.durationMinutes);
      const startsAt = lisbonDateTimeToUtc(date, start);
      const endsAt = lisbonDateTimeToUtc(date, end);
      if (startsAt.getTime() < earliest) continue;
      if (collides(interval(startsAt, endsAt), busy, config.bufferMinutes)) continue;
      slots.push({
        date,
        start,
        end,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
    }
  }
  return slots;
}

export function slotIsAvailable(
  requested: Pick<AvailableSlot, "date" | "start" | "end">,
  slots: AvailableSlot[],
) {
  return slots.some(
    (slot) =>
      slot.date === requested.date &&
      slot.start === requested.start &&
      slot.end === requested.end,
  );
}
