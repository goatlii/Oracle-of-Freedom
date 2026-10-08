"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteBooking, saveBooking } from "@/app/admin/calendar/actions";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  dayLabel,
  monthGrid,
  monthLabel,
  overlaps,
  shiftDate,
  shiftMonth,
  weekOf,
  type Booking,
  type BookingKind,
  type BookingStatus,
} from "@/lib/bookings";
import type { StorageMode } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const weekdays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const weekdayShort = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

const statusEs: Record<BookingStatus, string> = {
  hold: "En espera",
  confirmed: "Confirmada",
  done: "Hecha",
  cancelled: "Cancelada",
};
const kindEs: Record<BookingKind, string> = {
  meeting: "Reunión",
  session: "Sesión",
  event: "Evento",
};

const storageNote: Record<StorageMode, string> = {
  blob: "Guardado en el calendario privado. Esta pantalla no se publica en la web.",
  local: "Guardado solo en este ordenador. Esta pantalla no se publica en la web.",
  readonly: "No se puede guardar hasta conectar Vercel Blob.",
};

type Draft = {
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
};

function blank(date: string): Draft {
  return {
    id: "",
    title: "",
    kind: "meeting",
    status: "hold",
    date,
    allDay: false,
    start: "10:00",
    end: "11:00",
    place: "",
    client: "",
    contact: "",
    notes: "",
  };
}

function fromBooking(booking: Booking): Draft {
  return {
    id: booking.id,
    title: booking.title,
    kind: booking.kind,
    status: booking.status,
    date: booking.date,
    allDay: booking.allDay,
    start: booking.start || "10:00",
    end: booking.end || "11:00",
    place: booking.place,
    client: booking.client,
    contact: booking.contact,
    notes: booking.notes,
  };
}

function asBooking(draft: Draft): Booking {
  return {
    ...draft,
    id: draft.id || "draft",
    start: draft.allDay ? "" : draft.start,
    end: draft.allDay ? "" : draft.end,
  };
}

function chipClass(booking: Booking, clash: boolean) {
  return cn(
    "block w-full truncate rounded-full px-1.5 text-left text-[11px] leading-5",
    booking.status === "cancelled" && "bg-ink/5 text-ink/40 line-through",
    booking.status !== "cancelled" && booking.kind === "meeting" && "bg-clay text-ink",
    booking.status !== "cancelled" && booking.kind === "session" && "bg-moss/15 text-moss",
    booking.status !== "cancelled" && booking.kind === "event" && "bg-ember/25 text-ink",
    booking.status === "hold" && "ring-1 ring-ink/25 ring-dashed",
    clash && "ring-1 ring-terracotta",
  );
}

function whenLabel(booking: Booking) {
  if (booking.allDay) return "Todo el día";
  return `${booking.start}–${booking.end}`;
}

export function CalendarBoard({
  bookings,
  today,
  month,
  mode,
}: {
  bookings: Booking[];
  today: string;
  month: string;
  mode: StorageMode;
}) {
  const router = useRouter();
  const initialDate = today.startsWith(month) ? today : `${month}-01`;
  const [selected, setSelected] = useState(initialDate);
  const [draft, setDraft] = useState<Draft>(blank(initialDate));
  const [composerOpen, setComposerOpen] = useState(false);
  const [saveState, saveAction, pending] = useActionState(saveBooking, null);
  const [handled, setHandled] = useState<ActionState>(null);
  const [noticeFor, setNoticeFor] = useState("");

  if (saveState !== handled) {
    setHandled(saveState);
    if (saveState?.ok) {
      if (!draft.id) setDraft(blank(draft.date));
      setComposerOpen(false);
    }
  }

  useEffect(() => {
    if (saveState?.ok) router.refresh();
  }, [saveState, router]);

  const cells = monthGrid(month);
  const onDay = bookings.filter((item) => item.date === selected);
  const draftKey = draft.id || "new";
  const clashes = draft.title.trim()
    ? bookings.filter((item) => overlaps(asBooking(draft), item))
    : [];
  const showNotice = noticeFor === draftKey && (saveState?.ok || saveState?.error);
  const upcoming = bookings
    .filter((item) => item.date >= today && item.status !== "cancelled" && item.status !== "done")
    .slice(0, 6);

  function pickDay(date: string) {
    setSelected(date);
    setDraft(blank(date));
    setComposerOpen(false);
  }

  function openBooking(booking: Booking) {
    setSelected(booking.date);
    setDraft(fromBooking(booking));
    setComposerOpen(true);
  }

  function moveWeek(delta: number) {
    const next = shiftDate(selected, delta * 7);
    pickDay(next);
    if (!next.startsWith(month)) router.push(`/admin/calendar?month=${next.slice(0, 7)}`);
  }

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mt-8 grid gap-8">
      <p className="max-w-2xl text-sm text-ink/70">
        Reuniones, sesiones y eventos se quedan en el estudio. En espera se marca con línea discontinua. El borde terracota avisa de que esa hora se cruza con otra.
      </p>
      <p className="text-sm text-ink/70">{storageNote[mode]}</p>

      {upcoming.length > 0 ? (
        <section className="hidden md:block">
          <h2 className="font-serif text-2xl">Próximas</h2>
          <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {upcoming.map((booking) => (
              <li key={booking.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => openBooking(booking)}
                  className="rounded-2xl bg-white/70 px-4 py-3 text-left"
                >
                  <span className="block text-xs tracking-[0.14em] text-ink/50 uppercase">
                    {dayLabel(booking.date)}
                  </span>
                  <span className="mt-1 block font-medium">{booking.title}</span>
                  <span className="text-sm text-ink/60">
                    {whenLabel(booking)} · {statusEs[booking.status]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => moveWeek(-1)} className="min-h-11 rounded-full px-3 text-sm underline underline-offset-4">
            Anterior
          </button>
          <h2 className="font-serif text-2xl">{monthLabel(selected.slice(0, 7))}</h2>
          <button type="button" onClick={() => moveWeek(1)} className="min-h-11 rounded-full px-3 text-sm underline underline-offset-4">
            Siguiente
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs tracking-[0.12em] text-ink/45 uppercase">
          {weekdayShort.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {weekOf(selected).map((date) => {
            const marked = bookings.some((item) => item.date === date && item.status !== "cancelled");
            const active = date === selected;
            return (
              <button
                key={date}
                type="button"
                onClick={() => pickDay(date)}
                aria-pressed={active}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-2xl text-sm",
                  active ? "bg-terracotta text-white" : "bg-white/70",
                  date === today && !active && "ring-1 ring-ember",
                )}
              >
                {Number(date.slice(8))}
                {marked ? <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", active ? "bg-white" : "bg-terracotta")} /> : <span className="mt-1 h-1.5 w-1.5" />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="hidden rounded-3xl bg-white/70 p-3 md:block md:p-6">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/admin/calendar?month=${shiftMonth(month, -1)}`} className="rounded-full px-3 py-2 text-sm underline-offset-4 hover:underline">
            Anterior
          </Link>
          <h2 className="font-serif text-3xl">{monthLabel(month)}</h2>
          <div className="flex items-center gap-2">
            {month !== today.slice(0, 7) ? (
              <Link href="/admin/calendar" className="rounded-full px-3 py-2 text-sm underline-offset-4 hover:underline">
                Hoy
              </Link>
            ) : null}
            <Link href={`/admin/calendar?month=${shiftMonth(month, 1)}`} className="rounded-full px-3 py-2 text-sm underline-offset-4 hover:underline">
              Siguiente
            </Link>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] tracking-[0.14em] text-ink/45 uppercase">
          {weekdays.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const items = bookings.filter((item) => item.date === cell.date);
            const active = cell.date === selected;
            return (
              <div
                key={cell.date}
                className={cn(
                  "min-h-16 rounded-xl p-1 md:min-h-24 md:p-1.5",
                  active ? "bg-sand ring-1 ring-terracotta" : "bg-sand/40",
                  !cell.inMonth && "opacity-45",
                  cell.date === today && "ring-1 ring-ember",
                )}
              >
                <button
                  type="button"
                  onClick={() => pickDay(cell.date)}
                  aria-pressed={active}
                  aria-label={`${dayLabel(cell.date)}, ${items.length} citas`}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    cell.date === today && "bg-ember text-night",
                  )}
                >
                  {Number(cell.date.slice(8))}
                </button>
                <ul className="mt-1 grid gap-0.5">
                  {items.slice(0, 3).map((booking) => {
                    const clash = bookings.some((other) => overlaps(booking, other));
                    return (
                      <li key={booking.id}>
                        <button
                          type="button"
                          onClick={() => openBooking(booking)}
                          className={chipClass(booking, clash)}
                          title={`${booking.title}, ${whenLabel(booking)}`}
                        >
                          <span className="md:hidden">{booking.allDay ? "•" : booking.start}</span>
                          <span className="hidden md:inline">
                            {booking.allDay ? booking.title : `${booking.start} ${booking.title}`}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {items.length > 3 ? (
                    <li>
                      <button type="button" onClick={() => pickDay(cell.date)} className="text-[11px] text-ink/60">
                        +{items.length - 3}
                      </button>
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl bg-white/70 p-4 md:p-6">
          <h2 className="font-serif text-3xl">{dayLabel(selected)}</h2>
          <Button
            type="button"
            className="mt-4 w-full md:hidden"
            onClick={() => {
              setDraft(blank(selected));
              setComposerOpen(true);
            }}
          >
            Nueva cita
          </Button>
          <ul className="mt-4 grid gap-2">
            {onDay.length === 0 ? <li className="text-sm text-ink/60">Nada este día.</li> : null}
            {onDay.map((booking) => {
              const clash = bookings.some((other) => overlaps(booking, other));
              return (
                <li key={booking.id}>
                  <button
                    type="button"
                    onClick={() => openBooking(booking)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left",
                      draft.id === booking.id ? "border-terracotta bg-sand" : "border-ink/10",
                    )}
                  >
                    <span className="font-medium">{booking.title}</span>
                    <span className="mt-1 block text-sm text-ink/65">
                      {whenLabel(booking)} · {kindEs[booking.kind]} · {statusEs[booking.status]}
                      {booking.client ? ` · ${booking.client}` : ""}
                      {booking.place ? ` · ${booking.place}` : ""}
                    </span>
                    {clash ? <span className="mt-1 block text-sm text-terracotta-ink">Se cruza con otra cita.</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <Link href="/admin/calendar/settings" className="mt-6 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            Ajustes de reservas
          </Link>
        </section>

        <section
          className={cn(
            "bg-sand md:static md:z-auto md:block md:overflow-visible md:rounded-3xl md:bg-white/70 md:p-6",
            composerOpen ? "fixed inset-0 z-50 overflow-y-auto px-4 pt-6 pb-10" : "hidden",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-3xl">{draft.id ? "Editar cita" : "Nueva cita"}</h2>
            <button
              type="button"
              onClick={() => {
                setDraft(blank(selected));
                setComposerOpen(false);
              }}
              className="min-h-11 text-sm underline underline-offset-4 md:hidden"
            >
              Cerrar
            </button>
            {draft.id ? (
              <button type="button" onClick={() => setDraft(blank(selected))} className="hidden text-sm underline underline-offset-4 md:inline">
                Crear otra
              </button>
            ) : null}
          </div>
          <form action={saveAction} className="mt-5 grid gap-4" onSubmit={() => setNoticeFor(draftKey)}>
            <input type="hidden" name="id" value={draft.id} />
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={draft.title} onChange={(event) => setField("title", event.target.value)} required maxLength={120} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="kind">Tipo</Label>
                <select
                  id="kind"
                  name="kind"
                  value={draft.kind}
                  onChange={(event) => setField("kind", event.target.value as BookingKind)}
                  className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4"
                >
                  <option value="meeting">Reunión</option>
                  <option value="session">Sesión</option>
                  <option value="event">Evento</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  name="status"
                  value={draft.status}
                  onChange={(event) => setField("status", event.target.value as BookingStatus)}
                  className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4"
                >
                  <option value="hold">En espera</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="done">Hecha</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={draft.date}
                  onChange={(event) => {
                    setField("date", event.target.value);
                    setSelected(event.target.value);
                  }}
                  required
                />
              </div>
              <label className="flex h-12 items-center gap-2 text-sm">
                <input type="checkbox" name="allDay" checked={draft.allDay} onChange={(event) => setField("allDay", event.target.checked)} />
                Todo el día
              </label>
            </div>
            {draft.allDay ? null : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="start">Empieza</Label>
                  <Input id="start" name="start" type="time" value={draft.start} onChange={(event) => setField("start", event.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="end">Termina</Label>
                  <Input id="end" name="end" type="time" value={draft.end} onChange={(event) => setField("end", event.target.value)} required />
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="client">Con</Label>
                <Input id="client" name="client" value={draft.client} onChange={(event) => setField("client", event.target.value)} maxLength={120} />
              </div>
              <div>
                <Label htmlFor="contact">Contacto</Label>
                <Input id="contact" name="contact" value={draft.contact} onChange={(event) => setField("contact", event.target.value)} maxLength={160} />
              </div>
            </div>
            <div>
              <Label htmlFor="place">Lugar</Label>
              <Input id="place" name="place" value={draft.place} onChange={(event) => setField("place", event.target.value)} maxLength={160} />
            </div>
            <div>
              <Label htmlFor="notes">Nota</Label>
              <Textarea id="notes" name="notes" value={draft.notes} onChange={(event) => setField("notes", event.target.value)} maxLength={2000} className="min-h-24" />
            </div>
            {clashes.length > 0 ? (
              <p className="text-sm text-terracotta-ink">
                Se cruza con {clashes.map((item) => `${item.title} (${whenLabel(item)})`).join(", ")}. Puedes guardarla igual.
              </p>
            ) : null}
            {showNotice && saveState?.error ? (
              <p className="rounded-2xl bg-clay px-4 py-3 text-sm text-terracotta-ink" role="alert">
                {saveState.error}
              </p>
            ) : null}
            {showNotice && saveState?.ok ? (
              <p className="rounded-2xl bg-moss/15 px-4 py-3 text-sm text-moss" role="status">
                Guardada.
              </p>
            ) : null}
            <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap gap-3 bg-sand/95 px-4 py-3 md:static md:mx-0 md:bg-transparent md:px-0">
              <Button type="submit" disabled={pending || mode === "readonly"} className="w-full sm:w-auto">
                {pending ? "Guardando…" : draft.id ? "Guardar cambios" : "Guardar cita"}
              </Button>
              {draft.id ? (
                <Button type="submit" form="delete-booking" variant="outline" disabled={mode === "readonly"} className="w-full sm:w-auto">
                  Borrar
                </Button>
              ) : null}
            </div>
          </form>
          {draft.id ? (
            <form
              id="delete-booking"
              action={async (formData) => {
                await deleteBooking(formData);
                setDraft(blank(selected));
                router.refresh();
              }}
              className="hidden"
            >
              <input type="hidden" name="id" value={draft.id} />
            </form>
          ) : null}
        </section>
      </div>
    </div>
  );
}
