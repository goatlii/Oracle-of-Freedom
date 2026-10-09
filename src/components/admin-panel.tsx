"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { en } from "@/content/en";
import { es } from "@/content/es";
import { useStudioCopy, useStudioLang } from "@/components/studio-lang";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { deletePromo, savePrices, savePromo, type ActionState } from "@/app/admin/actions";
import { promoStatus, type CatalogItem, type LiveSettings, type Promo, type StorageMode } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const groupIds = ["portraits", "elopements", "retreats", "festivals", "places"] as const;

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

const deliveryLocales = ["en", "es", "pt"] as const;

export type TimingField = {
  key: string;
  token: string;
  label: string;
  hint: string;
  value: string;
};

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

function Notice({ state, saved }: { state: ActionState; saved: string }) {
  if (!state?.ok && !state?.error) return null;
  return (
    <p className={`rounded-2xl px-4 py-3 text-sm ${state.error ? "bg-clay text-terracotta-ink" : "bg-moss/15 text-moss"}`} role="status">
      {state.error || saved}
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
  deliveryDefaults: Record<string, Record<(typeof deliveryLocales)[number], string>>;
}) {
  const router = useRouter();
  const lang = useStudioLang();
  const t = useStudioCopy();
  const packageNames = useMemo(() => {
    const names: Record<string, string> = {};
    collectNames(lang === "en" ? en : es, names);
    return names;
  }, [lang]);
  const [priceState, savePriceAction, pricePending] = useActionState(savePrices, null);
  const [promoState, savePromoAction, promoPending] = useActionState(savePromo, null);
  const [draft, setDraft] = useState(emptyPromo);
  const [groupId, setGroupId] = useState<(typeof groupIds)[number]>("portraits");
  const [pane, setPane] = useState<"prices" | "delivery" | "promos">("prices");
  const [creating, setCreating] = useState(false);
  const [handledPromo, setHandledPromo] = useState<ActionState>(null);
  const promoEditing = creating || Boolean(draft.id);
  if (promoState !== handledPromo) {
    setHandledPromo(promoState);
    if (promoState?.ok) {
      setDraft(emptyPromo);
      setCreating(false);
    }
  }

  useEffect(() => {
    if (priceState?.ok || promoState?.ok) router.refresh();
  }, [priceState, promoState, router]);

  const ordered = useMemo(
    () => [...catalog].sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind]),
    [catalog],
  );

  function edit(promo: Promo) {
    setCreating(true);
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
    <div className="grid gap-6 md:gap-8">
      <div className="flex gap-2 overflow-x-auto md:hidden" role="tablist" aria-label={t.prices.heading}>
        {(["prices", "delivery", "promos"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={pane === id}
            onClick={() => setPane(id)}
            className={cn(
              "min-h-12 shrink-0 rounded-full px-4 text-sm",
              pane === id ? "bg-ink text-sand" : "bg-white",
            )}
          >
            {t.prices.panes[id]}
          </button>
        ))}
      </div>
      <section id="studio-prices" className={cn("rounded-3xl bg-white/70 p-4 md:block md:p-6", pane === "promos" && "max-md:hidden")}>
        <h2 className="hidden font-serif text-3xl md:block">{t.prices.heading}</h2>
        <p className={cn("text-sm text-ink/70 md:mt-2", pane === "prices" ? "mt-1" : "max-md:hidden")}>{t.prices.storage[mode]}</p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {groupIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setGroupId(id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm",
                id === groupId ? "bg-ink text-sand" : "bg-white",
              )}
              aria-pressed={id === groupId}
            >
              {t.prices.groups[id]}
            </button>
          ))}
        </div>
        <form action={savePriceAction} className="mt-6 grid gap-8">
          <fieldset id="shared-delivery" className={cn("gap-4", pane === "delivery" ? "grid" : "hidden md:grid")}>
            <legend className="font-serif text-2xl">{t.prices.shared}</legend>
            <p className="text-sm text-ink/70">{t.prices.sharedHelp}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {timingFields.map((field) => (
                <div key={field.key}>
                  <Label htmlFor={`timing-${field.key}`}>
                    {t.prices.timings[field.key as keyof typeof t.prices.timings]?.label ?? field.label}{" "}
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
                  <p className="mt-1 text-xs text-ink/55">{t.prices.timings[field.key as keyof typeof t.prices.timings]?.hint ?? field.hint}</p>
                </div>
              ))}
            </div>
          </fieldset>
          {groupIds.map((id) => (
            <fieldset key={id} className={cn("gap-4", id === groupId ? "grid" : "hidden md:grid")}>
              <legend className="font-serif text-2xl">{t.prices.groups[id]}</legend>
              {ordered
                .filter((item) => item.group === id)
                .map((item) => {
                  const saved = settings.prices[item.id];
                  const amount = saved?.from ?? item.from ?? "";
                  const visible = saved?.visible ?? true;
                  const lines = deliveryDefaults[item.id] ?? { en: "", es: "", pt: "" };
                  const name = packageNames[item.id] || item.label;
                  return (
                    <div key={item.id} data-package={item.id} className="grid gap-3 border-t border-ink/10 pt-4">
                      <div className="grid gap-3 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
                        <div>
                          <Label htmlFor={`from-${item.id}`}>{name}</Label>
                          <p className="text-xs tracking-[0.12em] text-ink/45 uppercase">
                            {t.prices.kind[item.kind]}
                          </p>
                          {item.plus ? (
                            <p className={cn("text-xs text-ink/55", pane !== "prices" && "max-md:hidden")}>{t.prices.fromPlus(amount)}</p>
                          ) : item.to ? (
                            <p className={cn("text-xs text-ink/55", pane !== "prices" && "max-md:hidden")}>{t.prices.fromRange(amount, item.to)}</p>
                          ) : null}
                        </div>
                        {item.custom ? (
                          <p className={cn("text-sm text-ink/60", pane !== "prices" && "max-md:hidden")}>{t.prices.quoteOnly}</p>
                        ) : (
                          <div className={cn(pane === "prices" ? "block" : "hidden md:block")}>
                            <Label htmlFor={`from-${item.id}`} className="sr-only">
                              {t.prices.eurosFor(name)}
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
                        <label className={cn("items-center gap-2 pb-3 text-sm", pane === "prices" ? "flex" : "hidden md:flex")}>
                          <input type="checkbox" name={`visible:${item.id}`} defaultChecked={visible} />
                          {t.prices.visible}
                        </label>
                      </div>
                      <fieldset className={cn("gap-3 md:grid-cols-3", pane === "delivery" ? "grid" : "hidden md:grid")}>
                        <legend className="mb-2 text-sm font-medium text-ink">{t.prices.deliveryLine}</legend>
                        {deliveryLocales.map((locale) => (
                          <div key={locale}>
                            <Label htmlFor={`delivery-${item.id}-${locale}`}>{t.prices.locales[locale]}</Label>
                            <Textarea
                              id={`delivery-${item.id}-${locale}`}
                              name={`delivery:${item.id}:${locale}`}
                              rows={2}
                              maxLength={240}
                              defaultValue={lines[locale]}
                              placeholder={t.prices.noDelivery}
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
          <Notice state={priceState} saved={t.prices.saved} />
          <div className="studio-dock border-t border-ink/10 bg-sand/95 px-4 py-3 md:static md:inset-auto md:border-0 md:bg-transparent md:px-0">
            <Button type="submit" disabled={pricePending || mode === "readonly"} className="w-full md:w-auto">
              {pricePending ? t.prices.saving : t.prices.save}
            </Button>
          </div>
        </form>
      </section>

      <section className={cn("rounded-3xl bg-white/70 p-4 md:p-6", pane !== "promos" && "max-md:hidden")}>
        <h2 className="hidden font-serif text-3xl md:block">{t.prices.promos}</h2>
        <p className={cn("text-sm text-ink/70 md:mt-2", promoEditing && "max-md:hidden")}>{t.prices.promosHelp}</p>
        <ul className={cn("mt-4 grid gap-3 md:mt-6", promoEditing && "max-md:hidden")}>
          {settings.promos.length === 0 ? <li className="text-sm text-ink/60">{t.prices.noPromos}</li> : null}
          {settings.promos.map((promo) => {
            const status = promoStatus(promo, today);
            return (
              <li key={promo.id} className="rounded-2xl border border-ink/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{promo.name}</p>
                    <p className="text-sm text-ink/70">
                      {promo.type === "percent" ? `${promo.amount}%` : `€${promo.amount}`} · {t.prices.promoStatus[status]}
                      {promo.code ? ` · ${t.prices.code(promo.code)}` : ""}
                    </p>
                    <p className="text-sm text-ink/60">
                      {promo.starts} → {promo.ends}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => edit(promo)}>
                      {t.prices.edit}
                    </Button>
                    <form action={deletePromo}>
                      <input type="hidden" name="id" value={promo.id} />
                      <Button type="submit" variant="outline" size="sm" disabled={mode === "readonly"}>
                        {t.prices.delete}
                      </Button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {promoEditing ? null : (
          <Button type="button" className="mt-4 w-full md:hidden" onClick={() => setCreating(true)}>
            {t.prices.newPromo}
          </Button>
        )}

        <form action={savePromoAction} className={cn("mt-8 gap-4 border-t border-ink/10 pt-6", promoEditing ? "grid" : "hidden md:grid")}>
          <h3 className="font-serif text-2xl">{draft.id ? t.prices.editPromo : t.prices.newPromo}</h3>
          <input type="hidden" name="id" value={draft.id} />
          <div>
            <Label htmlFor="promo-name">{t.prices.name}</Label>
            <Input id="promo-name" name="name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required className="text-base" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="promo-type">{t.prices.discount}</Label>
              <select
                id="promo-type"
                name="type"
                value={draft.type}
                onChange={(event) => setDraft({ ...draft, type: event.target.value === "fixed" ? "fixed" : "percent" })}
                className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 text-base"
              >
                <option value="percent">{t.prices.percent}</option>
                <option value="fixed">{t.prices.euros}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="promo-amount">{draft.type === "percent" ? t.prices.percent : t.prices.euros}</Label>
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
            <legend className="text-sm font-medium">{t.prices.appliesTo}</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="all"
                checked={draft.all}
                onChange={(event) => setDraft({ ...draft, all: event.target.checked })}
              />
              {t.prices.allSessions}
            </label>
            {draft.all
              ? null
              : groupIds.map((id) => (
                  <div key={id} className="mt-2">
                    <p className="text-xs tracking-[0.12em] text-ink/45 uppercase">{t.prices.groups[id]}</p>
                    {ordered
                      .filter((item) => item.group === id && !item.custom)
                      .map((item) => (
                        <label key={item.id} className="mt-1 flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name={`target:${item.id}`}
                            checked={draft.targets.includes(item.id)}
                            onChange={(event) => {
                              const targets = event.target.checked
                                ? [...draft.targets, item.id]
                                : draft.targets.filter((target) => target !== item.id);
                              setDraft({ ...draft, targets });
                            }}
                          />
                          {packageNames[item.id] || item.label}
                        </label>
                      ))}
                  </div>
                ))}
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="promo-starts">{t.prices.starts}</Label>
              <Input id="promo-starts" name="starts" type="date" value={draft.starts} onChange={(event) => setDraft({ ...draft, starts: event.target.value })} required className="text-base" />
            </div>
            <div>
              <Label htmlFor="promo-ends">{t.prices.ends}</Label>
              <Input id="promo-ends" name="ends" type="date" value={draft.ends} onChange={(event) => setDraft({ ...draft, ends: event.target.value })} required className="text-base" />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-code">{t.prices.codeOptional}</Label>
            <Input id="promo-code" name="code" value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} className="text-base" autoCapitalize="characters" />
          </div>
          <div>
            <Label htmlFor="banner-en">{t.prices.bannerEn}</Label>
            <Input id="banner-en" name="bannerEn" value={draft.bannerEn} onChange={(event) => setDraft({ ...draft, bannerEn: event.target.value })} className="text-base" />
          </div>
          <div>
            <Label htmlFor="banner-es">{t.prices.bannerEs}</Label>
            <Input id="banner-es" name="bannerEs" value={draft.bannerEs} onChange={(event) => setDraft({ ...draft, bannerEs: event.target.value })} className="text-base" />
          </div>
          <div>
            <Label htmlFor="banner-pt">{t.prices.bannerPt}</Label>
            <Input id="banner-pt" name="bannerPt" value={draft.bannerPt} onChange={(event) => setDraft({ ...draft, bannerPt: event.target.value })} className="text-base" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
            {t.prices.activate}
          </label>
          <Notice state={promoState} saved={t.prices.saved} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={promoPending || mode === "readonly"}>
              {promoPending ? t.prices.saving : draft.id ? t.prices.updatePromo : t.prices.createPromo}
            </Button>
            {draft.id || creating ? (
              <Button
                type="button"
                variant="outline"
                className={cn(!draft.id && "md:hidden")}
                onClick={() => {
                  setDraft(emptyPromo);
                  setCreating(false);
                }}
              >
                {t.prices.cancel}
              </Button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
