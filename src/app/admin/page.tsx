import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { isAdmin } from "@/lib/admin-auth";
import { dayLabel } from "@/lib/bookings";
import { readBookings } from "@/lib/booking-store";
import { readInquiries } from "@/lib/inquiry-store";
import { lisbonToday } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const today = lisbonToday();
  const [bookings, inquiries] = await Promise.all([readBookings(), readInquiries()]);
  const todayBookings = bookings.filter(
    (item) => item.date === today && item.status !== "cancelled",
  );
  const fresh = inquiries.filter((item) => item.status === "new");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-28 md:py-12 md:pb-12">
      <AdminHeader current="today" title="Hoy" />
      <p className="mt-3 text-lg text-ink/70">{dayLabel(today)}</p>

      <section className="mt-8">
        <h2 className="font-serif text-3xl">
          {fresh.length === 1 ? "1 solicitud nueva" : `${fresh.length} solicitudes nuevas`}
        </h2>
        <ul className="mt-4 grid gap-3">
          {fresh.length === 0 ? (
            <li className="text-sm text-ink/60">No hay solicitudes nuevas.</li>
          ) : null}
          {fresh.slice(0, 6).map((item) => (
            <li key={item.id}>
              <Link href={`/admin/inquiries/${item.id}`} className="block rounded-3xl bg-white/80 px-4 py-4">
                <span className="font-medium">{item.name}</span>
                <span className="mt-1 block text-sm text-ink/65">
                  {item.serviceLabel} · {item.when}
                </span>
                <span className="mt-1 block text-sm text-ink/65">{item.place}</span>
              </Link>
            </li>
          ))}
        </ul>
        {fresh.length > 0 ? (
          <Link href="/admin/inquiries" className="mt-4 inline-block text-sm underline underline-offset-4">
            Ver todas
          </Link>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-3xl">Agenda de hoy</h2>
        <ul className="mt-4 grid gap-3">
          {todayBookings.length === 0 ? (
            <li className="text-sm text-ink/60">Nada en la agenda de hoy.</li>
          ) : null}
          {todayBookings.map((item) => (
            <li key={item.id}>
              <Link href="/admin/calendar" className="block rounded-3xl bg-white/80 px-4 py-4">
                <span className="font-medium">
                  {item.allDay ? "Todo el día" : item.start} {item.title}
                </span>
                <span className="mt-1 block text-sm text-ink/65">
                  {item.client || "Sin nombre"}
                  {item.place ? ` · ${item.place}` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
