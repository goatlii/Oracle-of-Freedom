import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { CalendarBoard } from "@/components/calendar-board";
import { isAdmin } from "@/lib/admin-auth";
import { parseMonth } from "@/lib/bookings";
import { readBookings, writeBookings } from "@/lib/booking-store";
import { readCalendarConfig } from "@/lib/calendar-config-store";
import { syncLinkedGoogleBookings } from "@/lib/google-calendar";
import { lisbonToday } from "@/lib/pricing";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { month: requested } = await searchParams;
  const today = lisbonToday();
  const month = parseMonth(requested, today.slice(0, 7));
  const config = await readCalendarConfig();
  let bookings = await readBookings();
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  try {
    const synced = await syncLinkedGoogleBookings(
      config,
      bookings,
      `${month}-01`,
      `${month}-${String(lastDay).padStart(2, "0")}`,
    );
    bookings = synced.bookings;
    if (synced.changed) await writeBookings(bookings);
  } catch (error) {
    console.error("[calendar] Google event sync failed", error);
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-28 md:py-12 md:pb-12">
      <AdminHeader current="calendar" title="Agenda" />
      <CalendarBoard bookings={bookings} today={today} month={month} mode={storageMode()} />
    </main>
  );
}
