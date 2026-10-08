import type { Booking } from "@/lib/bookings";
import { lisbonDateTimeToUtc } from "@/lib/availability";
import { siteUrl } from "@/lib/content";

function escape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function utc(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function compactDate(value: string) {
  return value.replace(/-/g, "");
}

function nextDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function event(booking: Booking) {
  const description = [
    booking.client ? `With: ${booking.client}` : "",
    booking.contact ? `Contact: ${booking.contact}` : "",
    booking.notes,
  ]
    .filter(Boolean)
    .join("\n");
  const dates = booking.allDay
    ? [
        `DTSTART;VALUE=DATE:${compactDate(booking.date)}`,
        `DTEND;VALUE=DATE:${compactDate(nextDate(booking.date))}`,
      ]
    : [
        `DTSTART:${utc(lisbonDateTimeToUtc(booking.date, booking.start))}`,
        `DTEND:${utc(lisbonDateTimeToUtc(booking.date, booking.end))}`,
      ];
  return [
    "BEGIN:VEVENT",
    `UID:${escape(booking.id)}@oracleoffreedom.com`,
    `DTSTAMP:${utc(new Date())}`,
    ...dates,
    `SUMMARY:${escape(booking.title)}`,
    booking.place ? `LOCATION:${escape(booking.place)}` : "",
    description ? `DESCRIPTION:${escape(description)}` : "",
    `STATUS:${booking.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
    `URL:${siteUrl()}`,
    "END:VEVENT",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function bookingsIcal(bookings: Booking[], name = "Oracle of Freedom") {
  const events = bookings
    .filter((booking) => booking.status !== "cancelled")
    .map(event)
    .join("\r\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Oracle of Freedom//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escape(name)}`,
    "X-WR-TIMEZONE:Europe/Lisbon",
    events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function icalResponse(calendar: string, filename: string) {
  return new Response(calendar, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `inline; filename="${filename}"`,
      "cache-control": "private, no-store",
    },
  });
}
