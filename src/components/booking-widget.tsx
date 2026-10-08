"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { BookingCopy } from "@/content/booking";
import type { PublicBookingType } from "@/lib/calendar-config";
import type { AvailableSlot } from "@/lib/availability";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Result = {
  ok: boolean;
  calendarUrl?: string;
  error?: string;
};

export function BookingWidget({
  types,
  locale,
  copy,
  canSave,
}: {
  types: PublicBookingType[];
  locale: Locale;
  copy: BookingCopy;
  canSave: boolean;
}) {
  const [typeId, setTypeId] = useState(types[0]?.id || "");
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selected, setSelected] = useState<AvailableSlot | null>(null);
  const [loading, setLoading] = useState(Boolean(typeId));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!typeId) return;
    const controller = new AbortController();
    fetch(`/api/bookings/availability?type=${encodeURIComponent(typeId)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("availability");
        return (await response.json()) as { slots?: AvailableSlot[] };
      })
      .then((data) => {
        const next = data.slots || [];
        setSlots(next);
        setSelectedDate(next[0]?.date || "");
      })
      .catch((fetchError) => {
        if ((fetchError as Error).name !== "AbortError") setError(copy.error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [copy.error, typeId]);

  const dates = useMemo(
    () => Array.from(new Set(slots.map((slot) => slot.date))),
    [slots],
  );
  const times = slots.filter((slot) => slot.date === selectedDate);
  const currentType = types.find((item) => item.id === typeId);
  const dateLocale = locale === "pt" ? "pt-PT" : locale === "es" ? "es-ES" : "en-GB";

  function dateLabel(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    return new Intl.DateTimeFormat(dateLocale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  async function submit(formData: FormData) {
    if (!selected || !currentType || !canSave) return;
    setSending(true);
    setError("");
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        typeId: currentType.id,
        date: selected.date,
        start: selected.start,
        end: selected.end,
        name: formData.get("name"),
        email: formData.get("email"),
        note: formData.get("note"),
        company: formData.get("company"),
        consent: formData.get("consent") === "on",
        locale,
      }),
    });
    const data = (await response.json().catch(() => null)) as Result | null;
    setSending(false);
    if (!response.ok || !data?.ok) {
      setError(response.status === 429 ? copy.rate : copy.error);
      if (response.status === 409) {
        setSelected(null);
        const refresh = await fetch(
          `/api/bookings/availability?type=${encodeURIComponent(typeId)}`,
          { cache: "no-store" },
        );
        if (refresh.ok) {
          const available = (await refresh.json()) as { slots?: AvailableSlot[] };
          setSlots(available.slots || []);
        }
      }
      return;
    }
    setResult(data);
  }

  if (result?.ok) {
    return (
      <section className="rounded-3xl bg-white/75 p-6 md:p-10" aria-live="polite">
        <p className="text-xs tracking-[0.2em] text-ember uppercase">{copy.eyebrow}</p>
        <h2 className="mt-2 font-serif text-4xl">{copy.successTitle}</h2>
        <p className="mt-3 max-w-xl text-ink/70">{copy.successBody}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {result.calendarUrl ? (
            <Button asChild>
              <a href={result.calendarUrl}>{copy.download}</a>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setResult(null);
              setSelected(null);
            }}
          >
            {copy.again}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8">
      <section>
        <h2 className="font-serif text-3xl">{copy.chooseType}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {types.map((item) => {
            const active = item.id === typeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setLoading(true);
                  setSelected(null);
                  setError("");
                  setTypeId(item.id);
                }}
                aria-pressed={active}
                className={cn(
                  "rounded-3xl border p-5 text-left transition-colors",
                  active
                    ? "border-terracotta bg-white"
                    : "border-ink/10 bg-white/50 hover:border-ink/25",
                )}
              >
                <span className="font-serif text-2xl">{item.label[locale]}</span>
                <span className="mt-1 block text-sm text-ink/60">
                  {item.durationMinutes} {copy.duration}
                </span>
                <span className="mt-3 block text-sm text-ink/75">
                  {item.description[locale]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl">{copy.chooseTime}</h2>
        {loading ? <p className="mt-4 text-ink/60">{copy.loading}</p> : null}
        {!loading && dates.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-white/60 p-4 text-ink/70">{copy.unavailable}</p>
        ) : null}
        {!selected && error ? (
          <p className="mt-4 rounded-2xl bg-clay p-4 text-sm text-terracotta-ink" role="alert">
            {error}
          </p>
        ) : null}
        {dates.length > 0 ? (
          <>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelected(null);
                  }}
                  aria-pressed={selectedDate === date}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm capitalize",
                    selectedDate === date
                      ? "border-ink bg-ink text-sand"
                      : "border-ink/15 bg-white/50",
                  )}
                >
                  {dateLabel(date)}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {times.map((slot) => (
                <button
                  key={slot.startsAt}
                  type="button"
                  onClick={() => setSelected(slot)}
                  aria-pressed={selected?.startsAt === slot.startsAt}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm",
                    selected?.startsAt === slot.startsAt
                      ? "border-terracotta bg-terracotta text-white"
                      : "border-ink/15 bg-white/60 hover:border-terracotta",
                  )}
                >
                  {slot.start}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </section>

      {selected ? (
        <section className="rounded-3xl bg-white/75 p-5 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-3xl">{copy.yourDetails}</h2>
              <p className="mt-1 text-sm text-ink/65 capitalize">
                {dateLabel(selected.date)} · {selected.start}–{selected.end} · Europe/Lisbon
              </p>
            </div>
            <button
              type="button"
              className="text-sm underline underline-offset-4"
              onClick={() => setSelected(null)}
            >
              {copy.back}
            </button>
          </div>
          <form action={submit} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="booking-name">{copy.name}</Label>
                <Input id="booking-name" name="name" required maxLength={120} autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="booking-email">{copy.email}</Label>
                <Input id="booking-email" name="email" type="email" required maxLength={160} autoComplete="email" />
              </div>
            </div>
            <div>
              <Label htmlFor="booking-note">{copy.note}</Label>
              <Textarea id="booking-note" name="note" maxLength={2000} placeholder={copy.notePlaceholder} />
            </div>
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="booking-company">Company</Label>
              <Input id="booking-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>
            <label className="flex items-start gap-3 text-sm text-ink/75">
              <input type="checkbox" name="consent" required className="mt-1" />
              <span>{copy.consent}</span>
            </label>
            {error ? (
              <p className="rounded-2xl bg-clay p-4 text-sm text-terracotta-ink" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={sending || !canSave} className="w-full sm:w-auto">
              {sending ? copy.sending : copy.submit}
            </Button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
