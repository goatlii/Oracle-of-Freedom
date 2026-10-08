"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
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

type PublicSettings = Omit<CalendarConfig, "google" | "icalToken">;

const days = [
  ["1", "Lunes"],
  ["2", "Martes"],
  ["3", "Miércoles"],
  ["4", "Jueves"],
  ["5", "Viernes"],
  ["6", "Sábado"],
  ["0", "Domingo"],
] as const;

function Notice({ state, saved = "Ajustes guardados." }: { state: ActionState; saved?: string }) {
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
      {copied ? "Copiado" : "Copiar"}
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
  const [settings, setSettings] = useState(initial);
  const [state, action, pending] = useActionState(saveCalendarSettings, null);
  const [googleState, googleAction, googlePending] = useActionState(saveGoogleAppSettings, null);
  const [googleOpen, setGoogleOpen] = useState(Boolean(googleNotice));
  const [icalOpen, setIcalOpen] = useState(false);
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
    <section className="mt-8 grid gap-8">
      <div className="rounded-3xl bg-white/70 p-4 md:p-6">
        <h2 className="font-serif text-3xl">Página de reservas</h2>
        <p className="mt-2 text-sm text-ink/70">
          Elige lo que se puede reservar en <Link href="/book" className="underline underline-offset-4">/book</Link>.
          Las horas son de Lisboa.
        </p>
        <form action={action} className="mt-6 grid gap-7">
          <input type="hidden" name="settings" value={JSON.stringify(settings)} />
          <fieldset className="grid gap-4">
            <legend className="font-serif text-2xl">Tipos de cita</legend>
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
                      Quitar
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(["en", "es", "pt"] as const).map((locale) => (
                    <div key={locale}>
                      <Label htmlFor={`${item.id}-label-${locale}`}>
                        Nombre · {locale.toUpperCase()}
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
                        Descripción · {locale.toUpperCase()}
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
                    <Label htmlFor={`${item.id}-duration`}>Minutos</Label>
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
                    <Label htmlFor={`${item.id}-kind`}>Tipo</Label>
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
                      <option value="meeting">Reunión</option>
                      <option value="session">Sesión</option>
                      <option value="event">Evento</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addType} className="w-full sm:w-auto">
              Añadir tipo de cita
            </Button>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="font-serif text-2xl">Horario de la semana</legend>
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
                    <Label htmlFor={`${key}-start`}>Abre</Label>
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
                    <Label htmlFor={`${key}-end`}>Cierra</Label>
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
              <Label htmlFor="days-ahead">Días abiertos por delante</Label>
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
              <Label htmlFor="notice-hours">Aviso mínimo · horas</Label>
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
              <Label htmlFor="buffer-minutes">Margen · minutos</Label>
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
            <Label htmlFor="default-location">Lugar habitual</Label>
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
            {pending ? "Guardando…" : "Guardar ajustes"}
          </Button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl bg-white/70 p-4 md:p-6">
          <h2 className="font-serif text-3xl">Google Calendar</h2>
          {googleNotice ? (
            <p className="mt-3 rounded-2xl bg-clay p-3 text-sm">{googleNotice}</p>
          ) : null}
          {googleConnected ? (
            <p className="mt-3 text-sm text-ink/70">
              Conectado{googleAccount ? ` como ${googleAccount}` : ""}. Las citas nuevas se escriben en{" "}
              <span className="font-medium">{googleSummary}</span>.
            </p>
          ) : (
            <p className="mt-3 text-sm text-ink/70">
              Pulsa Iniciar y rellena las casillas. Los nombres y la dirección de vuelta ya están escritos y se pueden cambiar.
            </p>
          )}
          {!googleOpen ? (
            <Button type="button" className="mt-4" onClick={() => setGoogleOpen(true)}>
              Iniciar
            </Button>
          ) : (
            <div className="mt-4 grid gap-4">
              <ol className="grid list-decimal gap-4 pl-5 text-sm text-ink/80">
                <li>
                  Abre{" "}
                  <a className="underline underline-offset-4" href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">
                    Google Cloud Console
                  </a>{" "}
                  y crea un proyecto. Usa este nombre, o cámbialo:
                  <Label htmlFor="google-project-name" className="mt-3">Nombre del proyecto</Label>
                  <div className="flex gap-2">
                    <Input id="google-project-name" value={projectName} maxLength={80} onChange={(event) => setProjectName(event.target.value)} />
                    <CopyButton value={projectName} />
                  </div>
                </li>
                <li>En ese proyecto, abre APIs y servicios, luego Biblioteca, busca Google Calendar API y pulsa Habilitar.</li>
                <li>Abre APIs y servicios, luego Pantalla de consentimiento de OAuth. Elige Externo, añade la cuenta de Google del calendario y guarda.</li>
                <li>
                  Abre Credenciales, luego Crear credenciales, luego ID de cliente de OAuth. Elige Aplicación web. Usa este nombre, o cámbialo:
                  <Label htmlFor="google-client-name" className="mt-3">Nombre del cliente OAuth</Label>
                  <div className="flex gap-2">
                    <Input id="google-client-name" value={clientName} maxLength={80} onChange={(event) => setClientName(event.target.value)} />
                    <CopyButton value={clientName} />
                  </div>
                </li>
                <li>En URI de redireccionamiento autorizados, añade la dirección de abajo tal como está escrita.</li>
              </ol>
              <form action={googleAction} className="grid gap-4">
                <div>
                  <Label htmlFor="google-redirect">Dirección de vuelta autorizada</Label>
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
                    placeholder="Pega el Client ID"
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
                    placeholder={secretSaved ? "Ya está guardado. Pega uno nuevo solo para cambiarlo." : "Pega el Client secret"}
                    autoComplete="off"
                  />
                </div>
                <Notice state={googleState} saved="Datos de Google guardados. Pulsa Conectar Google Calendar e inicia sesión." />
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={googlePending || mode === "readonly"}>
                    {googlePending ? "Guardando…" : "Guardar estos datos"}
                  </Button>
                  {googleConfigured ? (
                    <Button asChild>
                      <Link href="/api/admin/google/connect" prefetch={false}>Conectar Google Calendar</Link>
                    </Button>
                  ) : null}
                  <Button type="button" variant="outline" onClick={() => setGoogleOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </form>
            </div>
          )}
          {googleConnected && googleCalendars.length > 1 ? (
            <form action={selectGoogleCalendar} className="mt-4 grid gap-3">
              <Label htmlFor="google-calendar">Calendario de las citas</Label>
              <select
                id="google-calendar"
                name="calendarId"
                defaultValue={googleCalendarId}
                className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4"
              >
                {googleCalendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.summary}{calendar.primary ? " · principal" : ""}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline">Usar este calendario</Button>
            </form>
          ) : null}
          {googleConnected ? (
            <form action={disconnectGoogleCalendar} className="mt-4">
              <Button type="submit" variant="outline">Desconectar Google</Button>
            </form>
          ) : null}
        </section>

        <section className="rounded-3xl bg-white/70 p-4 md:p-6">
          <h2 className="font-serif text-3xl">Suscripción iCal</h2>
          <p className="mt-3 text-sm text-ink/70">
            Pulsa Iniciar, copia la dirección privada y pégala en la app de calendario. El nombre ya está listo para cambiarlo.
          </p>
          {!icalOpen ? (
            <Button type="button" className="mt-4" onClick={() => setIcalOpen(true)}>
              Iniciar
            </Button>
          ) : (
            <div className="mt-4 grid gap-4">
              <div>
                <Label htmlFor="ical-name">Nombre del calendario</Label>
                <div className="flex gap-2">
                  <Input id="ical-name" value={calendarName} maxLength={80} onChange={(event) => setCalendarName(event.target.value)} />
                  <CopyButton value={calendarName} />
                </div>
              </div>
              <div>
                <Label htmlFor="ical-feed">Dirección privada</Label>
                <div className="flex gap-2">
                  <Input id="ical-feed" readOnly value={feedUrl} className="text-xs" />
                  <CopyButton value={feedUrl} />
                </div>
              </div>
              <ol className="grid list-decimal gap-3 pl-5 text-sm text-ink/80">
                <li>Calendario de Apple en un Mac: Archivo, luego Nueva suscripción a calendario. Pega la dirección privada. Si pide un nombre, usa el de arriba.</li>
                <li>iPhone: Ajustes, luego Calendario, luego Cuentas, luego Añadir cuenta, luego Otra, luego Añadir calendario suscrito. Pega la dirección privada.</li>
                <li>Outlook: Añadir calendario, luego Suscribirse desde la web. Pega la dirección privada y usa el nombre de arriba.</li>
                <li>Otra cuenta de Google: Ajustes, luego Añadir calendario, luego Desde URL. Pega la dirección privada. Google puede tardar varias horas en mostrar las citas nuevas.</li>
              </ol>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href={feedUrl.replace(/^https?:/, "webcal:")}>Suscribirse</a>
                </Button>
                <form action={regenerateIcalToken}>
                  <Button type="submit" variant="outline">Crear otro enlace privado</Button>
                </form>
                <Button type="button" variant="outline" onClick={() => setIcalOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
