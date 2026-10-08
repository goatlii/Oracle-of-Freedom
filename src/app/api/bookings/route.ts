import { randomBytes, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { bookingCopy } from "@/content/booking";
import type { Locale } from "@/i18n/routing";
import { slotIsAvailable } from "@/lib/availability";
import { publicAvailability } from "@/lib/booking-service";
import { writeBookings } from "@/lib/booking-store";
import type { Booking } from "@/lib/bookings";
import { bookingsIcal } from "@/lib/ical";
import { upsertGoogleEvent } from "@/lib/google-calendar";
import { settings, siteUrl } from "@/lib/content";

const schema = z.object({
  typeId: z.string().regex(/^[a-z0-9-]{1,60}$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(160),
  note: z.string().trim().max(2000).optional(),
  locale: z.enum(["en", "es", "pt"]),
  consent: z.literal(true),
  company: z.string().max(200).optional(),
});

const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function sendConfirmation(booking: Booking, typeLabel: string, locale: Locale) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.RESEND_FROM_EMAIL || "Oracle of Freedom <onboarding@resend.dev>";
  const to = process.env.INQUIRY_TO_EMAIL || settings.email;
  const copy = bookingCopy[locale];
  const downloadUrl = `${siteUrl()}/api/bookings/${booking.publicToken}/calendar`;
  const details = [
    typeLabel,
    `${booking.date} · ${booking.start}–${booking.end} (Europe/Lisbon)`,
    booking.place,
    "",
    booking.notes || "",
    "",
    `${copy.download}: ${downloadUrl}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const calendar = bookingsIcal([booking], typeLabel);
  const resend = new Resend(apiKey);
  const [admin, attendee] = await Promise.all([
    resend.emails.send({
      from,
      to,
      replyTo: booking.contact,
      subject: `New booking · ${typeLabel} · ${booking.client}`,
      text: [
        `Name: ${booking.client}`,
        `Email: ${booking.contact}`,
        `When: ${booking.date} · ${booking.start}–${booking.end}`,
        `Type: ${typeLabel}`,
        `Notes: ${booking.notes || "—"}`,
      ].join("\n"),
    }),
    resend.emails.send({
      from,
      to: booking.contact,
      replyTo: to,
      subject: copy.successTitle,
      text: `${copy.successBody}\n\n${details}`,
      attachments: [
        {
          filename: "oracle-of-freedom-booking.ics",
          content: Buffer.from(calendar),
        },
      ],
    }),
  ]);
  if (admin.error || attendee.error) {
    console.error("[booking] confirmation email failed", admin.error || attendee.error);
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const data = parsed.data;
  if (data.company?.trim()) return NextResponse.json({ ok: true, emailed: false });

  const available = await publicAvailability(data.typeId);
  if (
    !available ||
    !slotIsAvailable(
      { date: data.date, start: data.start, end: data.end },
      available.slots,
    )
  ) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 409 });
  }

  const label = available.bookingType.label[data.locale];
  let booking: Booking = {
    id: randomUUID(),
    title: `${label} · ${data.name}`,
    kind: available.bookingType.kind,
    status: "confirmed",
    date: data.date,
    allDay: false,
    start: data.start,
    end: data.end,
    place: available.config.defaultLocation,
    client: data.name,
    contact: data.email,
    notes: data.note || "",
    origin: "web",
    bookingTypeId: data.typeId,
    locale: data.locale,
    publicToken: randomBytes(24).toString("base64url"),
  };

  try {
    await writeBookings([...available.bookings, booking]);
  } catch (error) {
    console.error("[booking] storage failed", error);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 503 });
  }
  let googleAdded = false;
  try {
    const synced = await upsertGoogleEvent(available.config, booking);
    if (synced.googleEventId) {
      booking = synced;
      googleAdded = true;
      await writeBookings([
        ...available.bookings,
        booking,
      ]);
    }
  } catch (error) {
    console.error("[booking] Google event creation failed", error);
  }

  let emailed = false;
  try {
    emailed = await sendConfirmation(booking, label, data.locale);
  } catch (error) {
    console.error("[booking] email failed", error);
  }

  revalidatePath("/admin/calendar");
  revalidatePath("/book");
  return NextResponse.json({
    ok: true,
    emailed,
    googleAdded,
    calendarUrl: `/api/bookings/${booking.publicToken}/calendar`,
  });
}
