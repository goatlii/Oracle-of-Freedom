"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { es } from "@/content/es";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { deletePromo, savePrices, savePromo, type ActionState } from "@/app/admin/actions";
import { promoStatus, type CatalogItem, type LiveSettings, type Promo, type StorageMode } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const groups = [
  { id: "portraits", label: "Retratos" },
  { id: "elopements", label: "Elopements" },
  { id: "retreats", label: "Retiros" },
  { id: "festivals", label: "Festivales" },
  { id: "places", label: "Lugares" },
] as const;

const kindOrder = { photo: 0, video: 1, combo: 2, addon: 3 };

function collectNames(value: unknown, into: Record<string, string>) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (
      child &&
      typeof child === "object" &&
      "name" in child &&
      "items" in child &&
      Array.isArray((child as { items: unknown }).items) &&
      typeof (child as { name: unknown }).name === "string"
    ) {
      into[key] = (child as { name: string }).name;
    } else {
      collectNames(child, into);
    }
  }
}

const spanishNames = (() => {
  const names: Record<string, string> = {};
  collectNames(es, names);
  return names;
})();

function studioLabel(item: CatalogItem) {
  return spanishNames[item.id] || item.label;
}

const timingCopy: Record<string, { label: string; hint: string }> = {
  artistGalleryWeeks: {
    label: "Galerías de fotos",
    hint: "Retratos, kits de prensa, sets en directo y galerías de festival",
  },
  artistFilmWeeks: {
    label: "Películas y reels",
    hint: "Las fichas que usan esta frase. Una ficha con su propia frase, como el videoclip, se queda como está.",
  },
  elopementGalleryWeeks: {
    label: "Fotos de elopement",
    hint: "El plazo de la galería en fotos de elopement y boda pequeña",
  },
  elopementFilmWeeks: {
    label: "Películas de elopement",
    hint: "La película de elopement y el resumen de la boda pequeña",
  },
  expressPhotoDays: {
    label: "Fotos exprés",
    hint: "La frase de fotos urgentes, por ejemplo ~7 días",
  },
  expressFilmDays: {
    label: "Película exprés",
    hint: "La frase de película urgente, por ejemplo 10–14 días",
  },
};

function kindLabel(kind: CatalogItem["kind"]) {
  if (kind === "combo") return "Foto y vídeo";
  if (kind === "addon") return "Extra";
  if (kind === "photo") return "Foto";
  return "Vídeo";
}

const storageNote: Record<StorageMode, string> = {
  blob: "Los cambios se ven en la web en unos segundos. El precio es el mismo en los tres idiomas. El plazo puede cambiar en cada idioma.",
  local: "Solo este ordenador. La web pública sigue con los precios y los plazos de partida hasta conectar Vercel Blob.",
  readonly: "No se puede guardar hasta conectar Vercel Blob. Quien visita sigue viendo los precios y los plazos de partida.",
};

const deliveryLocales = [
  { id: "en", label: "Inglés" },
  { id: "es", label: "Español" },
  { id: "pt", label: "Portugués" },
] as const;

export type TimingField = {
  key: string;
  token: string;
  label: string;
  hint: string;
  value: string;
};

const statusLabel = { live: "Viva", scheduled: "Programada", ended: "Terminada", off: "Apagada" };

type PromoDraft = {
  id: string;
  name: string;
  type: "percent" | "fixed";
  amount: string;
  all: boolean;
  targets: string[];
  starts: string;
  ends: string;
  code: string;
  bannerEn: string;
  bannerEs: string;
  bannerPt: string;
  active: boolean;
};

const emptyPromo: PromoDraft = {
  id: "",
  name: "",
  type: "percent",
  amount: "",
  all: true,
  targets: [],
  starts: "",
  ends: "",
  code: "",
  bannerEn: "",
  bannerEs: "",
  bannerPt: "",
  active: true,
};

function Notice({ state }: { state: ActionState }) {
  if (!state?.ok && !state?.error) return null;
  return (
    <p className={`rounded-2xl px-4 py-3 text-sm ${state.error ? "bg-clay text-terracotta-ink" : "bg-moss/15 text-moss"}`} role="status">
      {state.error || "Guardado. La web se actualiza en unos segundos."}
    </p>
  );
}

export function AdminPanel({
  catalog,
  settings,
  today,
  mode,
  timingFields,
  deliveryDefaults,
}: {
  catalog: CatalogItem[];
  settings: LiveSettings;
  today: string;
  mode: StorageMode;
  timingFields: TimingField[];
  deliveryDefaults: Record<string, Record<(typeof deliveryLocales)[number]["id"], string>>;
}) {
  const router = useRouter();
  const [priceState, savePriceAction, pricePending] = useActionState(savePrices, null);
  const [promoState, savePromoAction, promoPending] = useActionState(savePromo, null);
  const [draft, setDraft] = useState(emptyPromo);
  const [groupId, setGroupId] = useState<(typeof groups)[number]["id"]>("portraits");
  const [handledPromo, setHandledPromo] = useState<ActionState>(null);
  if (promoState !== handledPromo) {
    setHandledPromo(promoState);
    if (promoState?.ok) setDraft(emptyPromo);
  }

  useEffect(() => {
    if (priceState?.ok || promoState?.ok) router.refresh();
  }, [priceState, promoState, router]);

  const ordered = useMemo(
    () => [...catalog].sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind]),
    [catalog],
  );

  function edit(promo: Promo) {
    setDraft({
      id: promo.id,
      name: promo.name,
      type: promo.type,
      amount: String(promo.amount),
      all: promo.targets === "all",
      targets: promo.targets === "all" ? [] : promo.targets,
      starts: promo.starts,
      ends: promo.ends,
      code: promo.code,
      bannerEn: promo.banner.en,
      bannerEs: promo.banner.es,
      bannerPt: promo.banner.pt,
      active: promo.active,
    });
  }

  return (
    <div className="grid gap-8">
      <section id="studio-prices" className="rounded-3xl bg-white/70 p-4 md:p-6">
        <h2 className="font-serif text-3xl">Precios y plazos</h2>
        <p className="mt-2 text-sm text-ink/70">{storageNote[mode]}</p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setGroupId(group.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm",
                group.id === groupId ? "bg-ink text-sand" : "bg-white",
              )}
              aria-pressed={group.id === groupId}
            >
              {group.label}
            </button>
          ))}
        </div>
        <form action={savePriceAction} className="mt-6 grid gap-8">
          <fieldset id="shared-delivery" className="grid gap-4">
            <legend className="font-serif text-2xl">Plazos compartidos</legend>
            <p className="text-sm text-ink/70">
              Estas frases cortas rellenan los huecos en todas las páginas, también en las preguntas y en los pasos después de una reserva. Déjala igual para conservar el texto de hoy. Una ficha de abajo puede seguir con su propia frase.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {timingFields.map((field) => (
                <div key={field.key}>
                  <Label htmlFor={`timing-${field.key}`}>
                    {timingCopy[field.key]?.label ?? field.label}{" "}
                    <span className="font-normal text-ink/50">{field.token}</span>
                  </Label>
                  <Input
                    id={`timing-${field.key}`}
                    name={`timing:${field.key}`}
                    defaultValue={field.value}
                    maxLength={40}
                    autoComplete="off"
                    className="text-base"
                  />
                  <p className="mt-1 text-xs text-ink/55">{timingCopy[field.key]?.hint ?? field.hint}</p>
                </div>
              ))}
            </div>
          </fieldset>
          {groups.map((group) => (
            <fieldset key={group.id} className={cn("gap-4", group.id === groupId ? "grid" : "hidden md:grid")}>
              <legend className="font-serif text-2xl">{group.label}</legend>
              {ordered
                .filter((item) => item.group === group.id)
                .map((item) => {
                  const saved = settings.prices[item.id];
                  const amount = saved?.from ?? item.from ?? "";
                  const visible = saved?.visible ?? true;
                  const lines = deliveryDefaults[item.id] ?? { en: "", es: "", pt: "" };
                  return (
                    <div key={item.id} data-package={item.id} className="grid gap-3 border-t border-ink/10 pt-4">
                      <div className="grid gap-3 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
                        <div>
                          <Label htmlFor={`from-${item.id}`}>{studioLabel(item)}</Label>
                          <p className="text-xs tracking-[0.12em] text-ink/45 uppercase">
                            {kindLabel(item.kind)}
                          </p>
                          {item.plus ? (
                            <p className="text-xs text-ink/55">En la web se ve desde €{amount}+</p>
                          ) : item.to ? (
                            <p className="text-xs text-ink/55">En la web se ve desde €{amount}–{item.to}</p>
                          ) : null}
                        </div>
                        {item.custom ? (
                          <p className="text-sm text-ink/60">Solo presupuesto</p>
                        ) : (
                          <div>
                            <Label htmlFor={`from-${item.id}`} className="sr-only">
                              Euros de {studioLabel(item)}
                            </Label>
                            <Input
                              id={`from-${item.id}`}
                              name={`from:${item.id}`}
                              type="number"
                              inputMode="numeric"
                              min={1}
                              step={1}
                              defaultValue={amount}
                              className="text-base"
                            />
                          </div>
                        )}
                        <label className="flex items-center gap-2 pb-3 text-sm">
                          <input type="checkbox" name={`visible:${item.id}`} defaultChecked={visible} />
                          Visible
                        </label>
                      </div>
                      <fieldset className="grid gap-3 md:grid-cols-3">
                        <legend className="mb-2 text-sm font-medium text-ink">Plazo de entrega</legend>
                        {deliveryLocales.map((locale) => (
                          <div key={locale.id}>
                            <Label htmlFor={`delivery-${item.id}-${locale.id}`}>{locale.label}</Label>
                            <Textarea
                              id={`delivery-${item.id}-${locale.id}`}
                              name={`delivery:${item.id}:${locale.id}`}
                              rows={2}
                              maxLength={240}
                              defaultValue={lines[locale.id]}
                              placeholder="Sin plazo en esta ficha"
                              autoComplete="off"
                              className="min-h-20"
                            />
                          </div>
                        ))}
                      </fieldset>
                    </div>
                  );
                })}
            </fieldset>
          ))}
          <Notice state={priceState} />
          <div
            className="fixed inset-x-0 z-30 border-t border-ink/10 bg-sand/95 px-4 py-3 md:static md:inset-auto md:border-0 md:bg-transparent md:px-0"
            style={{ bottom: "calc(3.4rem + env(safe-area-inset-bottom))" }}
          >
            <Button type="submit" disabled={pricePending || mode === "readonly"} className="w-full md:w-auto">
              {pricePending ? "Guardando…" : "Guardar precios y plazos"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-white/70 p-4 md:p-6">
        <h2 className="font-serif text-3xl">Promociones</h2>
        <p className="mt-2 text-sm text-ink/70">
          Una promoción viva tacha el precio anterior. Si añades un código, el formulario lo pide y lo incluye en el email y en WhatsApp. Al pasar la fecha final, desaparece sola.
        </p>
        <ul className="mt-6 grid gap-3">
          {settings.promos.length === 0 ? <li className="text-sm text-ink/60">Todavía no hay promociones.</li> : null}
          {settings.promos.map((promo) => {
            const status = promoStatus(promo, today);
            return (
              <li key={promo.id} className="rounded-2xl border border-ink/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{promo.name}</p>
                    <p className="text-sm text-ink/70">
                      {promo.type === "percent" ? `${promo.amount}%` : `€${promo.amount}`} · {statusLabel[status]}
                      {promo.code ? ` · código ${promo.code}` : ""}
                    </p>
                    <p className="text-sm text-ink/60">
                      {promo.starts} → {promo.ends}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => edit(promo)}>
                      Editar
                    </Button>
                    <form action={deletePromo}>
                      <input type="hidden" name="id" value={promo.id} />
                      <Button type="submit" variant="outline" size="sm" disabled={mode === "readonly"}>
                        Borrar
                      </Button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <form action={savePromoAction} className="mt-8 grid gap-4 border-t border-ink/10 pt-6">
          <h3 className="font-serif text-2xl">{draft.id ? "Editar promoción" : "Nueva promoción"}</h3>
          <input type="hidden" name="id" value={draft.id} />
          <div>
            <Label htmlFor="promo-name">Nombre</Label>
            <Input id="promo-name" name="name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required className="text-base" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="promo-type">Descuento</Label>
              <select
                id="promo-type"
                name="type"
                value={draft.type}
                onChange={(event) => setDraft({ ...draft, type: event.target.value === "fixed" ? "fixed" : "percent" })}
                className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 text-base"
              >
                <option value="percent">Porcentaje</option>
                <option value="fixed">Euros</option>
              </select>
            </div>
            <div>
              <Label htmlFor="promo-amount">{draft.type === "percent" ? "Porcentaje" : "Euros"}</Label>
              <Input
                id="promo-amount"
                name="amount"
                type="number"
                inputMode="numeric"
                min={1}
                max={draft.type === "percent" ? 90 : 5000}
                step={1}
                value={draft.amount}
                onChange={(event) => setDraft({ ...draft, amount: event.target.value })}
                required
                className="text-base"
              />
            </div>
          </div>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Se aplica a</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="all"
                checked={draft.all}
                onChange={(event) => setDraft({ ...draft, all: event.target.checked })}
              />
              Todas las sesiones
            </label>
            {draft.all
              ? null
              : groups.map((group) => (
                  <div key={group.id} className="mt-2">
                    <p className="text-xs tracking-[0.12em] text-ink/45 uppercase">{group.label}</p>
                    {ordered
                      .filter((item) => item.group === group.id && !item.custom)
                      .map((item) => (
                        <label key={item.id} className="mt-1 flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name={`target:${item.id}`}
                            checked={draft.targets.includes(item.id)}
                            onChange={(event) => {
                              const targets = event.target.checked
                                ? [...draft.targets, item.id]
                                : draft.targets.filter((id) => id !== item.id);
                              setDraft({ ...draft, targets });
                            }}
                          />
                          {studioLabel(item)}
                        </label>
                      ))}
                  </div>
                ))}
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="promo-starts">Empieza</Label>
              <Input id="promo-starts" name="starts" type="date" value={draft.starts} onChange={(event) => setDraft({ ...draft, starts: event.target.value })} required className="text-base" />
            </div>
            <div>
              <Label htmlFor="promo-ends">Termina</Label>
              <Input id="promo-ends" name="ends" type="date" value={draft.ends} onChange={(event) => setDraft({ ...draft, ends: event.target.value })} required className="text-base" />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-code">Código (opcional)</Label>
            <Input id="promo-code" name="code" value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} className="text-base" autoCapitalize="characters" />
          </div>
          <div>
            <Label htmlFor="banner-en">Aviso en inglés (opcional)</Label>
            <Input id="banner-en" name="bannerEn" value={draft.bannerEn} onChange={(event) => setDraft({ ...draft, bannerEn: event.target.value })} className="text-base" />
          </div>
          <div>
            <Label htmlFor="banner-es">Aviso en español (opcional)</Label>
            <Input id="banner-es" name="bannerEs" value={draft.bannerEs} onChange={(event) => setDraft({ ...draft, bannerEs: event.target.value })} className="text-base" />
          </div>
          <div>
            <Label htmlFor="banner-pt">Aviso en portugués (opcional)</Label>
            <Input id="banner-pt" name="bannerPt" value={draft.bannerPt} onChange={(event) => setDraft({ ...draft, bannerPt: event.target.value })} className="text-base" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
            Activar esta promoción
          </label>
          <Notice state={promoState} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={promoPending || mode === "readonly"}>
              {promoPending ? "Guardando…" : draft.id ? "Actualizar promoción" : "Crear promoción"}
            </Button>
            {draft.id ? (
              <Button type="button" variant="outline" onClick={() => setDraft(emptyPromo)}>
                Cancelar
              </Button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
