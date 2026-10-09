"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useStudioCopy, useStudioLang } from "@/components/studio-lang";
import {
  disconnectGoogleCalendar,
  regenerateIcalToken,
  saveCalendarSettings,
  saveGoogleAppSettings,
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
import { cn } from "@/lib/utils";

type PublicSettings = Omit<CalendarConfig, "google" | "icalToken">;

const dayKeys = ["1", "2", "3", "4", "5", "6", "0"] as const;

function Notice({ state, saved }: { state: ActionState; saved: string }) {
  if (!state?.ok && !state?.error) return null;
  return (
    <p
      className={`rounded-2xl px-4 py-3 text-sm ${
        state.error ? "bg-clay text-terracotta-ink" : "bg-moss/15 text-moss"
      }`}
      role={state.error ? "alert" : "status"}
    >
      {state.error || saved}
    </p>
  );
}

function CopyButton({ value }: { value: string }) {
  const t = useStudioCopy();
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      className="shrink-0"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
      }}
    >
      {copied ? t.settings.copied : t.settings.copy}
    </Button>
  );
}

export function CalendarSettings({
  initial,
  mode,
  feedUrl,
  redirectUri,
  savedClientId,
  secretSaved,
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
  redirectUri: string;
  savedClientId: string;
  secretSaved: boolean;
  googleConfigured: boolean;
  googleConnected: boolean;
  googleCalendarId: string;
  googleSummary: string;
  googleAccount: string;
  googleCalendars: GoogleCalendarOption[];
  googleNotice?: string;
}) {
  const lang = useStudioLang();
  const t = useStudioCopy();
  const days = dayKeys.map((key, index) => [
    key,
    new Intl.DateTimeFormat(lang, { weekday: "long", timeZone: "UTC" }).format(
      new Date(Date.UTC(2024, 0, 1 + index)),
    ),
  ] as const);
  const [settings, setSettings] = useState(initial);
  const [state, action, pending] = useActionState(saveCalendarSettings, null);
  const [googleState, googleAction, googlePending] = useActionState(saveGoogleAppSettings, null);
  const [googleOpen, setGoogleOpen] = useState(Boolean(googleNotice));
  const [icalOpen, setIcalOpen] = useState(false);
  const [phonePane, setPhonePane] = useState<"hours" | "google" | "ical" | null>(googleNotice ? "google" : null);
  const [projectName, setProjectName] = useState("Oracle of Freedom");
  const [clientName, setClientName] = useState("Oracle of Freedom Studio");
  const [calendarName, setCalendarName] = useState("Oracle of Freedom");
  const [redirectValue, setRedirectValue] = useState(redirectUri);

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
    <section className="mt-4 grid gap-4 md:mt-8 md:gap-8">
      <div className="rounded-3xl bg-white/70 p-4 md:p-6">
        <h2 className="font-serif text-2xl md:text-3xl">
          <span className="md:hidden">{t.settings.hours}</span>
          <span className="hidden md:inline">{t.settings.page}</span>
        </h2>
        <Button
          type="button"
          className={cn("mt-4 md:hidden", phonePane === "hours" && "hidden")}
          onClick={() => setPhonePane("hours")}
        >
          {t.settings.start}
        </Button>
        <div className={cn(phonePane === "hours" ? "mt-4" : "max-md:hidden")}>
        <p className="text-sm text-ink/70">
          {t.settings.pageHelpBefore}
          <Link href="/book" className="underline underline-offset-4">/book</Link>
          {t.settings.pageHelpAfter}
        </p>
        <form action={action} className="mt-6 grid gap-7">
          <input type="hidden" name="settings" value={JSON.stringify(settings)} />
          <fieldset className="grid gap-4">
            <legend className="font-serif text-2xl">{t.settings.types}</legend>
            {settings.bookingTypes.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-2xl border border-ink/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(event) => updateType(item.id, { active: event.target.checked })}
                    />
                    {t.settings.visible}
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
                      {t.settings.remove}
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(["en", "es", "pt"] as const).map((locale) => (
                    <div key={locale}>
                      <Label htmlFor={`${item.id}-label-${locale}`}>
                        {t.settings.nameLocale(locale.toUpperCase())}
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
                        {t.settings.descriptionLocale(locale.toUpperCase())}
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
                    <Label htmlFor={`${item.id}-duration`}>{t.settings.minutes}</Label>
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
                    <Label htmlFor={`${item.id}-kind`}>{t.settings.type}</Label>
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
                      <option value="meeting">{t.calendar.kind.meeting}</option>
                      <option value="session">{t.calendar.kind.session}</option>
                      <option value="event">{t.calendar.kind.event}</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addType} className="w-full sm:w-auto">
              {t.settings.addType}
            </Button>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="font-serif text-2xl">{t.settings.week}</legend>
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
                    <Label htmlFor={`${key}-start`}>{t.settings.opens}</Label>
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
                    <Label htmlFor={`${key}-end`}>{t.settings.closes}</Label>
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
              <Label htmlFor="days-ahead">{t.settings.daysAhead}</Label>
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
              <Label htmlFor="notice-hours">{t.settings.notice}</Label>
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
              <Label htmlFor="buffer-minutes">{t.settings.buffer}</Label>
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
            <Label htmlFor="default-location">{t.settings.usualPlace}</Label>
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
          <Notice state={state} saved={t.settings.saved} />
          <Button type="submit" disabled={pending || mode === "readonly"} className="w-full sm:w-auto">
            {pending ? t.settings.saving : t.settings.save}
          </Button>
          <Button type="button" variant="outline" className="w-full md:hidden" onClick={() => setPhonePane(null)}>
            {t.settings.close}
          </Button>
        </form>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl bg-white/70 p-4 md:p-6">
          <h2 className="font-serif text-2xl md:text-3xl">Google Calendar</h2>
          {googleNotice ? (
            <p className="mt-3 rounded-2xl bg-clay p-3 text-sm">{googleNotice}</p>
          ) : null}
          {googleConnected ? (
            <p className="mt-3 text-sm text-ink/70">
              {t.settings.connected(googleAccount, googleSummary)}
            </p>
          ) : (
            <p className="mt-3 text-sm text-ink/70">{t.settings.googleIntro}</p>
          )}
          <Button
            type="button"
            className={cn("mt-4", googleOpen && "md:hidden", phonePane === "google" && "max-md:hidden")}
            onClick={() => {
              setGoogleOpen(true);
              setPhonePane("google");
            }}
          >
            {t.settings.start}
          </Button>
          <div className={cn("mt-4 gap-4", phonePane === "google" ? "max-md:grid" : "max-md:hidden", googleOpen ? "md:grid" : "md:hidden")}>
              <ol className="grid list-decimal gap-4 pl-5 text-sm text-ink/80">
                <li>
                  {t.settings.projectOpen}{" "}
                  <a className="underline underline-offset-4" href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">
                    Google Cloud Console
                  </a>{" "}
                  {t.settings.projectAfter}
                  <Label htmlFor="google-project-name" className="mt-3">{t.settings.projectName}</Label>
                  <div className="flex gap-2">
                    <Input id="google-project-name" value={projectName} maxLength={80} onChange={(event) => setProjectName(event.target.value)} />
                    <CopyButton value={projectName} />
                  </div>
                </li>
                <li>{t.settings.enableApi}</li>
                <li>{t.settings.consent}</li>
                <li>
                  {t.settings.clientBefore}
                  <Label htmlFor="google-client-name" className="mt-3">{t.settings.clientName}</Label>
                  <div className="flex gap-2">
                    <Input id="google-client-name" value={clientName} maxLength={80} onChange={(event) => setClientName(event.target.value)} />
                    <CopyButton value={clientName} />
                  </div>
                </li>
                <li>{t.settings.redirectHelp}</li>
              </ol>
              <form action={googleAction} className="grid gap-4">
                <div>
                  <Label htmlFor="google-redirect">{t.settings.redirect}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="google-redirect"
                      name="redirectUri"
                      value={redirectValue}
                      className="text-xs"
                      onChange={(event) => setRedirectValue(event.target.value)}
                    />
                    <CopyButton value={redirectValue} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="google-client-id">Client ID</Label>
                  <Input
                    id="google-client-id"
                    name="clientId"
                    defaultValue={savedClientId}
                    placeholder={t.settings.pasteClientId}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <Label htmlFor="google-client-secret">Client secret</Label>
                  <Input
                    id="google-client-secret"
                    name="clientSecret"
                    type="password"
                    placeholder={secretSaved ? t.settings.secretSaved : t.settings.pasteSecret}
                    autoComplete="off"
                  />
                </div>
                <Notice state={googleState} saved={t.settings.googleSaved} />
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={googlePending || mode === "readonly"}>
                    {googlePending ? t.settings.saving : t.settings.saveDetails}
                  </Button>
                  {googleConfigured ? (
                    <Button asChild>
                      <Link href="/api/admin/google/connect" prefetch={false}>{t.settings.connect}</Link>
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setGoogleOpen(false);
                      setPhonePane((current) => (current === "google" ? null : current));
                    }}
                  >
                    {t.settings.close}
                  </Button>
                </div>
              </form>
          </div>
          {googleConnected && googleCalendars.length > 1 ? (
            <form action={selectGoogleCalendar} className="mt-4 grid gap-3">
              <Label htmlFor="google-calendar">{t.settings.calendarOf}</Label>
              <select
                id="google-calendar"
                name="calendarId"
                defaultValue={googleCalendarId}
                className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4"
              >
                {googleCalendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.summary}{calendar.primary ? t.settings.primary : ""}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline">{t.settings.useCalendar}</Button>
            </form>
          ) : null}
          {googleConnected ? (
            <form action={disconnectGoogleCalendar} className="mt-4">
              <Button type="submit" variant="outline">{t.settings.disconnect}</Button>
            </form>
          ) : null}
        </section>

        <section className="rounded-3xl bg-white/70 p-4 md:p-6">
          <h2 className="font-serif text-2xl md:text-3xl">{t.settings.ical}</h2>
          <p className="mt-3 text-sm text-ink/70">{t.settings.icalIntro}</p>
          <Button
            type="button"
            className={cn("mt-4", icalOpen && "md:hidden", phonePane === "ical" && "max-md:hidden")}
            onClick={() => {
              setIcalOpen(true);
              setPhonePane("ical");
            }}
          >
            {t.settings.start}
          </Button>
          <div className={cn("mt-4 gap-4", phonePane === "ical" ? "max-md:grid" : "max-md:hidden", icalOpen ? "md:grid" : "md:hidden")}>
              <div>
                <Label htmlFor="ical-name">{t.settings.calendarName}</Label>
                <div className="flex gap-2">
                  <Input id="ical-name" value={calendarName} maxLength={80} onChange={(event) => setCalendarName(event.target.value)} />
                  <CopyButton value={calendarName} />
                </div>
              </div>
              <div>
                <Label htmlFor="ical-feed">{t.settings.privateAddress}</Label>
                <div className="flex gap-2">
                  <Input id="ical-feed" readOnly value={feedUrl} className="text-xs" />
                  <CopyButton value={feedUrl} />
                </div>
              </div>
              <ol className="grid list-decimal gap-3 pl-5 text-sm text-ink/80">
                <li>{t.settings.appleMac}</li>
                <li>{t.settings.iphone}</li>
                <li>{t.settings.outlook}</li>
                <li>{t.settings.otherGoogle}</li>
              </ol>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href={feedUrl.replace(/^https?:/, "webcal:")}>{t.settings.subscribe}</a>
                </Button>
                <form action={regenerateIcalToken}>
                  <Button type="submit" variant="outline">{t.settings.newLink}</Button>
                </form>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIcalOpen(false);
                    setPhonePane((current) => (current === "ical" ? null : current));
                  }}
                >
                  {t.settings.close}
                </Button>
              </div>
            </div>
        </section>
      </div>
    </section>
  );
}
