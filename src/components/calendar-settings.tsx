"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  disconnectGoogleCalendar,
  regenerateIcalToken,
  saveCalendarSettings,
  selectGoogleCalendar,
} from "@/app/admin/calendar/settings-actions";
import type { ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type {
  CalendarConfig,
  PublicBookingType,
} from "@/lib/calendar-config";
import type { GoogleCalendarOption } from "@/lib/google-calendar";
import type { StorageMode } from "@/lib/pricing";

type PublicSettings = Omit<CalendarConfig, "google" | "icalToken">;

const days = [
  ["1", "Monday"],
  ["2", "Tuesday"],
  ["3", "Wednesday"],
  ["4", "Thursday"],
  ["5", "Friday"],
  ["6", "Saturday"],
  ["0", "Sunday"],
] as const;

function Notice({ state }: { state: ActionState }) {
  if (!state?.ok && !state?.error) return null;
  return (
    <p
      className={`rounded-2xl px-4 py-3 text-sm ${
        state.error ? "bg-clay text-terracotta-ink" : "bg-moss/15 text-moss"
      }`}
      role={state.error ? "alert" : "status"}
    >
      {state.error || "Calendar settings saved."}
    </p>
  );
}

export function CalendarSettings({
  initial,
  mode,
  feedUrl,
  googleConfigured,
  googleConnected,
  googleCalendarId,
  googleSummary,
  googleAccount,
  googleCalendars,
  googleNotice,
}: {
  initial: PublicSettings;
  mode: StorageMode;
  feedUrl: string;
  googleConfigured: boolean;
  googleConnected: boolean;
  googleCalendarId: string;
  googleSummary: string;
  googleAccount: string;
  googleCalendars: GoogleCalendarOption[];
  googleNotice?: string;
}) {
  const [settings, setSettings] = useState(initial);
  const [state, action, pending] = useActionState(saveCalendarSettings, null);

  function updateType(id: string, patch: Partial<PublicBookingType>) {
    setSettings((current) => ({
      ...current,
      bookingTypes: current.bookingTypes.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addType() {
    if (settings.bookingTypes.length >= 12) return;
    const id = `custom-${Date.now()}`;
    setSettings((current) => ({
      ...current,
      bookingTypes: [
        ...current.bookingTypes,
        {
          id,
          label: { en: "New meeting", es: "Nueva cita", pt: "Nova marcação" },
          description: {
            en: "Add a short description.",
            es: "Añade una descripción breve.",
            pt: "Adiciona uma descrição breve.",
          },
          durationMinutes: 30,
          kind: "meeting",
          active: true,
        },
      ],
    }));
  }

  return (
    <section className="mt-8 grid gap-8">
      <div className="rounded-3xl bg-white/70 p-4 md:p-6">
        <h2 className="font-serif text-3xl">Public booking page</h2>
        <p className="mt-2 text-sm text-ink/70">
          Choose what visitors can book at <Link href="/book" className="underline underline-offset-4">/book</Link>.
          Times use Europe/Lisbon.
        </p>
        <form action={action} className="mt-6 grid gap-7">
          <input type="hidden" name="settings" value={JSON.stringify(settings)} />
          <fieldset className="grid gap-4">
            <legend className="font-serif text-2xl">Meeting types</legend>
            {settings.bookingTypes.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-2xl border border-ink/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(event) => updateType(item.id, { active: event.target.checked })}
                    />
                    Visible
                  </label>
                  {settings.bookingTypes.length > 1 ? (
                    <button
                      type="button"
                      className="text-sm underline underline-offset-4"
                      onClick={() =>
                        setSettings((current) => ({
                          ...current,
                          bookingTypes: current.bookingTypes.filter((type) => type.id !== item.id),
                        }))
                      }
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(["en", "es", "pt"] as const).map((locale) => (
                    <div key={locale}>
                      <Label htmlFor={`${item.id}-label-${locale}`}>
                        Name · {locale.toUpperCase()}
                      </Label>
                      <Input
                        id={`${item.id}-label-${locale}`}
                        value={item.label[locale]}
                        maxLength={80}
                        onChange={(event) =>
                          updateType(item.id, {
                            label: { ...item.label, [locale]: event.target.value },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(["en", "es", "pt"] as const).map((locale) => (
                    <div key={locale}>
                      <Label htmlFor={`${item.id}-description-${locale}`}>
                        Description · {locale.toUpperCase()}
                      </Label>
                      <Textarea
                        id={`${item.id}-description-${locale}`}
                        value={item.description[locale]}
                        maxLength={240}
                        className="min-h-24"
                        onChange={(event) =>
                          updateType(item.id, {
                            description: {
                              ...item.description,
                              [locale]: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${item.id}-duration`}>Duration in minutes</Label>
                    <Input
                      id={`${item.id}-duration`}
                      type="number"
                      min={15}
                      max={480}
                      step={15}
                      value={item.durationMinutes}
                      onChange={(event) =>
                        updateType(item.id, { durationMinutes: Number(event.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${item.id}-kind`}>Kind</Label>
                    <select
                      id={`${item.id}-kind`}
                      value={item.kind}
                      onChange={(event) =>
                        updateType(item.id, {
                          kind: event.target.value as PublicBookingType["kind"],
                        })
                      }
                      className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="session">Session</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addType} className="w-full sm:w-auto">
              Add meeting type
            </Button>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="font-serif text-2xl">Weekly hours</legend>
            {days.map(([key, label]) => {
              const value = settings.weekly[key];
              return (
                <div key={key} className="grid gap-3 border-t border-ink/10 pt-3 sm:grid-cols-[10rem_1fr_1fr] sm:items-end">
                  <label className="flex h-12 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={value.enabled}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          weekly: {
                            ...current.weekly,
                            [key]: { ...value, enabled: event.target.checked },
                          },
                        }))
                      }
                    />
                    {label}
                  </label>
                  <div>
                    <Label htmlFor={`${key}-start`}>Opens</Label>
                    <Input
                      id={`${key}-start`}
                      type="time"
                      value={value.start}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          weekly: {
                            ...current.weekly,
                            [key]: { ...value, start: event.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${key}-end`}>Closes</Label>
                    <Input
                      id={`${key}-end`}
                      type="time"
                      value={value.end}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          weekly: {
                            ...current.weekly,
                            [key]: { ...value, end: event.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              );
            })}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="days-ahead">Days open ahead</Label>
              <Input
                id="days-ahead"
                type="number"
                min={1}
                max={365}
                value={settings.daysAhead}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, daysAhead: Number(event.target.value) }))
                }
              />
            </div>
            <div>
              <Label htmlFor="notice-hours">Minimum notice · hours</Label>
              <Input
                id="notice-hours"
                type="number"
                min={0}
                max={720}
                value={settings.minimumNoticeHours}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    minimumNoticeHours: Number(event.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="buffer-minutes">Buffer · minutes</Label>
              <Input
                id="buffer-minutes"
                type="number"
                min={0}
                max={180}
                step={5}
                value={settings.bufferMinutes}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    bufferMinutes: Number(event.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="default-location">Default place</Label>
            <Input
              id="default-location"
              value={settings.defaultLocation}
              maxLength={160}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  defaultLocation: event.target.value,
                }))
              }
            />
          </div>
          <Notice state={state} />
          <Button type="submit" disabled={pending || mode === "readonly"} className="w-full sm:w-auto">
            {pending ? "Saving…" : "Save booking settings"}
          </Button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl bg-white/70 p-4 md:p-6">
          <h2 className="font-serif text-3xl">Google Calendar</h2>
          {googleNotice ? (
            <p className="mt-3 rounded-2xl bg-clay p-3 text-sm">{googleNotice}</p>
          ) : null}
          {!googleConfigured ? (
            <p className="mt-3 text-sm text-ink/70">
              Add the Google OAuth environment variables to connect an account.
            </p>
          ) : googleConnected ? (
            <>
              <p className="mt-3 text-sm text-ink/70">
                Connected{googleAccount ? ` as ${googleAccount}` : ""}. New bookings are written to{" "}
                <span className="font-medium">{googleSummary}</span>.
              </p>
              {googleCalendars.length > 1 ? (
                <form action={selectGoogleCalendar} className="mt-4 grid gap-3">
                  <Label htmlFor="google-calendar">Calendar for bookings</Label>
                  <select
                    id="google-calendar"
                    name="calendarId"
                    defaultValue={googleCalendarId}
                    className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4"
                  >
                    {googleCalendars.map((calendar) => (
                      <option key={calendar.id} value={calendar.id}>
                        {calendar.summary}{calendar.primary ? " · primary" : ""}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline">Use this calendar</Button>
                </form>
              ) : null}
              <form action={disconnectGoogleCalendar} className="mt-4">
                <Button type="submit" variant="outline">Disconnect Google</Button>
              </form>
            </>
          ) : (
            <Button asChild className="mt-4">
              <Link href="/api/admin/google/connect" prefetch={false}>Connect Google Calendar</Link>
            </Button>
          )}
        </section>

        <section className="rounded-3xl bg-white/70 p-4 md:p-6">
          <h2 className="font-serif text-3xl">iCal subscription</h2>
          <p className="mt-3 text-sm text-ink/70">
            This private link shows the studio calendar in Apple Calendar, Outlook and other calendar apps.
          </p>
          <Label htmlFor="ical-feed" className="mt-4">Private feed URL</Label>
          <Input id="ical-feed" readOnly value={feedUrl} className="text-xs" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <a href={feedUrl.replace(/^https?:/, "webcal:")}>Subscribe</a>
            </Button>
            <form action={regenerateIcalToken}>
              <Button type="submit" variant="outline">Regenerate private link</Button>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
}
