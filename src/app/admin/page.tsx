import Link from "next/link";
import { redirect } from "next/navigation";
import { en } from "@/content/en";
import { es } from "@/content/es";
import { AdminHeader } from "@/components/admin-header";
import { isAdmin } from "@/lib/admin-auth";
import { dayLabel, type Booking } from "@/lib/bookings";
import { readBookings } from "@/lib/booking-store";
import { readInquiries } from "@/lib/inquiry-store";
import { lisbonToday } from "@/lib/pricing";
import { inquiryWhen, studioCopy } from "@/lib/studio-copy";
import { studioLang } from "@/lib/studio-locale.server";

export const dynamic = "force-dynamic";

function lisbonClock(now = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
}

function nextBooking(items: Booking[], now: string) {
  const upcoming = items
    .filter((item) => item.allDay || item.start >= now)
    .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.start.localeCompare(b.start));
  if (upcoming[0]) return upcoming[0];
  return [...items].sort((a, b) => b.start.localeCompare(a.start))[0];
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const lang = await studioLang();
  const t = studioCopy(lang);
  const services = (lang === "en" ? en : es).form.services;
  const today = lisbonToday();
  const [bookings, inquiries] = await Promise.all([readBookings(), readInquiries()]);
  const todayBookings = bookings.filter(
    (item) => item.date === today && item.status !== "cancelled",
  );
  const fresh = inquiries.filter((item) => item.status === "new");
  const featuredBooking = todayBookings.length > 0 ? nextBooking(todayBookings, lisbonClock()) : undefined;
  const featuredInquiry = featuredBooking ? undefined : fresh[0];
  const later = featuredBooking ? todayBookings.filter((item) => item.id !== featuredBooking.id) : [];
  const moreInquiries = fresh.length - (featuredInquiry ? 1 : 0);

  return (
    <main className="studio-page mx-auto max-w-3xl px-4 py-4 md:py-12">
      <AdminHeader current="today" title={t.home.title} />
      <p className="mt-2 text-sm text-ink/60 md:mt-3 md:text-lg">{dayLabel(today, lang)}</p>

      {featuredBooking ? (
        <Link href="/admin/calendar" className="mt-5 block rounded-3xl bg-white px-5 py-5 shadow-sm">
          <span className="text-xs tracking-[0.16em] text-ember uppercase">{t.home.next}</span>
          <span className="mt-2 block font-serif text-3xl">
            {featuredBooking.allDay ? t.home.allDay : featuredBooking.start} {featuredBooking.title}
          </span>
          <span className="mt-1 block text-sm text-ink/65">
            {featuredBooking.client || t.home.noName}
            {featuredBooking.place ? ` · ${featuredBooking.place}` : ""}
          </span>
        </Link>
      ) : featuredInquiry ? (
        <Link href={`/admin/inquiries/${featuredInquiry.id}`} className="mt-5 block rounded-3xl bg-white px-5 py-5 shadow-sm">
          <span className="text-xs tracking-[0.16em] text-ember uppercase">{t.home.next}</span>
          <span className="mt-2 block font-serif text-3xl">{featuredInquiry.name}</span>
          <span className="mt-1 block text-sm text-ink/65">
            {(featuredInquiry.service in services
              ? services[featuredInquiry.service as keyof typeof services]
              : featuredInquiry.serviceLabel)}{" "}
            · {inquiryWhen(featuredInquiry.when, t)}
          </span>
        </Link>
      ) : (
        <div className="mt-5 rounded-3xl bg-white/80 px-5 py-5">
          <p className="text-ink/70">{t.home.empty}</p>
          <Link
            href="/admin/calendar"
            className="mt-4 inline-flex min-h-12 items-center rounded-full bg-terracotta px-5 text-sm font-medium text-white"
          >
            {t.calendar.newBooking}
          </Link>
        </div>
      )}

      {later.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-sm text-ink/55">{t.home.rest}</h2>
          <ul className="mt-2 divide-y divide-ink/10">
            {later.map((item) => (
              <li key={item.id}>
                <Link href="/admin/calendar" className="flex min-h-12 items-center gap-3 py-2">
                  <span className="w-14 shrink-0 text-sm text-ink/55">
                    {item.allDay ? t.home.allDay : item.start}
                  </span>
                  <span className="truncate font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {moreInquiries > 0 ? (
        <Link href="/admin/inquiries" className="mt-4 flex min-h-12 items-center text-sm underline underline-offset-4">
          {t.home.moreInquiries(moreInquiries)}
        </Link>
      ) : null}
    </main>
  );
}
