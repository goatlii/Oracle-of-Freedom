import { timingSafeEqual } from "node:crypto";
import { readBookings } from "@/lib/booking-store";
import { readCalendarConfig } from "@/lib/calendar-config-store";
import { bookingsIcal, icalResponse } from "@/lib/ical";

export const dynamic = "force-dynamic";

function tokensMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const config = await readCalendarConfig();
  if (!token || !tokensMatch(token, config.icalToken)) {
    return new Response("Not found", { status: 404 });
  }
  return icalResponse(
    bookingsIcal(await readBookings(), "Agota · Oracle of Freedom"),
    "oracle-of-freedom-calendar.ics",
  );
}
