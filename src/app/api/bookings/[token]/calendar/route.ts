import { readBookings } from "@/lib/booking-store";
import { bookingsIcal, icalResponse } from "@/lib/ical";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const booking = (await readBookings()).find(
    (item) => item.publicToken === token && item.status !== "cancelled",
  );
  if (!booking) return new Response("Not found", { status: 404 });
  return icalResponse(
    bookingsIcal([booking], booking.title),
    "oracle-of-freedom-booking.ics",
  );
}
