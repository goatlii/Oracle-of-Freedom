"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deletePromo, savePrices, savePromo, type ActionState } from "@/app/admin/actions";
import { promoStatus, type CatalogItem, type LiveSettings, type Promo, type StorageMode } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const groups = [
  { id: "portraits", label: "Portrait sessions" },
  { id: "elopements", label: "Elopements & small weddings" },
  { id: "retreats", label: "Retreats" },
  { id: "festivals", label: "Festivals, DJs & artists" },
  { id: "places", label: "Hotels & stays" },
] as const;

const kindOrder = { photo: 0, video: 1, combo: 2, addon: 3 };

function kindLabel(kind: CatalogItem["kind"]) {
  if (kind === "combo") return "Photo + film";
  if (kind === "addon") return "Add-on";
  return kind;
}

const storageNote: Record<StorageMode, string> = {
  blob: "Saves go live on the website within a few seconds. The same price is used in English, Spanish and Portuguese.",
  local: "This computer only. Saves stay on this machine until Vercel Blob is connected. The public site still uses the starting prices.",
  readonly: "Saving is switched off until Vercel Blob is connected. Visitors still see the starting prices.",
};

const statusLabel = { live: "Live", scheduled: "Scheduled", ended: "Ended", off: "Off" };

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
      {state.error || "Saved. The website updates within a few seconds."}
    </p>
  );
}

export function AdminPanel({
  catalog,
  settings,
  today,
  mode,
}: {
  catalog: CatalogItem[];
  settings: LiveSettings;
  today: string;
  mode: StorageMode;
}) {
  const router = useRouter();
  const [priceState, savePriceAction, pricePending] = useActionState(savePrices, null);
  const [promoState, savePromoAction, promoPending] = useActionState(savePromo, null);
  const [draft, setDraft] = useState(emptyPromo);
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
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl bg-white/70 p-4 md:p-6">
        <h2 className="font-serif text-3xl">Prices</h2>
        <p className="mt-2 text-sm text-ink/70">{storageNote[mode]}</p>
        <form action={savePriceAction} className="mt-6 grid gap-8">
          {groups.map((group) => (
            <fieldset key={group.id} className="grid gap-4">
              <legend className="font-serif text-2xl">{group.label}</legend>
              {ordered
                .filter((item) => item.group === group.id)
                .map((item) => {
                  const saved = settings.prices[item.id];
                  const amount = saved?.from ?? item.from ?? "";
                  const visible = saved?.visible ?? true;
                  return (
                    <div key={item.id} className="grid gap-3 border-t border-ink/10 pt-4 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
                      <div>
                        <Label htmlFor={`from-${item.id}`}>{item.label}</Label>
                        <p className="text-xs tracking-[0.12em] text-ink/45 uppercase">
                          {kindLabel(item.kind)}
                        </p>
                      </div>
                      {item.custom ? (
                        <p className="text-sm text-ink/60">Quote only</p>
                      ) : (
                        <div>
                          <Label htmlFor={`from-${item.id}`} className="sr-only">
                            Euros for {item.label}
                          </Label>
                          <Input
                            id={`from-${item.id}`}
                            name={`from:${item.id}`}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            defaultValue={amount}
                            required
                            className="text-base"
                          />
                        </div>
                      )}
                      <label className="flex items-center gap-2 pb-3 text-sm">
                        <input type="checkbox" name={`visible:${item.id}`} defaultChecked={visible} />
                        Show
                      </label>
                    </div>
                  );
                })}
            </fieldset>
          ))}
          <Notice state={priceState} />
          <Button type="submit" disabled={pricePending || mode === "readonly"} className="w-full sm:w-auto">
            {pricePending ? "Saving…" : "Save prices"}
          </Button>
        </form>
      </section>

      <section className="rounded-3xl bg-white/70 p-4 md:p-6">
        <h2 className="font-serif text-3xl">Promotions</h2>
        <p className="mt-2 text-sm text-ink/70">
          A live promotion shows the old price crossed out. If you add a code, the inquiry form asks for it and includes it in the email and WhatsApp message. When the end date passes, it disappears on its own.
        </p>
        <ul className="mt-6 grid gap-3">
          {settings.promos.length === 0 ? <li className="text-sm text-ink/60">No promotions yet.</li> : null}
          {settings.promos.map((promo) => {
            const status = promoStatus(promo, today);
            return (
              <li key={promo.id} className="rounded-2xl border border-ink/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{promo.name}</p>
                    <p className="text-sm text-ink/70">
                      {promo.type === "percent" ? `${promo.amount}% off` : `€${promo.amount} off`} · {statusLabel[status]}
                      {promo.code ? ` · code ${promo.code}` : ""}
                    </p>
                    <p className="text-sm text-ink/60">
                      {promo.starts} → {promo.ends}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => edit(promo)}>
                      Edit
                    </Button>
                    <form action={deletePromo}>
                      <input type="hidden" name="id" value={promo.id} />
                      <Button type="submit" variant="outline" size="sm" disabled={mode === "readonly"}>
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <form action={savePromoAction} className="mt-8 grid gap-4 border-t border-ink/10 pt-6">
          <h3 className="font-serif text-2xl">{draft.id ? "Edit promotion" : "New promotion"}</h3>
          <input type="hidden" name="id" value={draft.id} />
          <div>
            <Label htmlFor="promo-name">Name</Label>
            <Input id="promo-name" name="name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required className="text-base" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="promo-type">Discount</Label>
              <select
                id="promo-type"
                name="type"
                value={draft.type}
                onChange={(event) => setDraft({ ...draft, type: event.target.value === "fixed" ? "fixed" : "percent" })}
                className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 text-base"
              >
                <option value="percent">Percent off</option>
                <option value="fixed">Euros off</option>
              </select>
            </div>
            <div>
              <Label htmlFor="promo-amount">{draft.type === "percent" ? "Percent" : "Euros"}</Label>
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
            <legend className="text-sm font-medium">Applies to</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="all"
                checked={draft.all}
                onChange={(event) => setDraft({ ...draft, all: event.target.checked })}
              />
              All sessions
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
                          {item.label}
                        </label>
                      ))}
                  </div>
                ))}
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="promo-starts">Starts</Label>
              <Input id="promo-starts" name="starts" type="date" value={draft.starts} onChange={(event) => setDraft({ ...draft, starts: event.target.value })} required className="text-base" />
            </div>
            <div>
              <Label htmlFor="promo-ends">Ends</Label>
              <Input id="promo-ends" name="ends" type="date" value={draft.ends} onChange={(event) => setDraft({ ...draft, ends: event.target.value })} required className="text-base" />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-code">Promo code (optional)</Label>
            <Input id="promo-code" name="code" value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} className="text-base" autoCapitalize="characters" />
          </div>
          <div>
            <Label htmlFor="banner-en">Banner in English (optional)</Label>
            <Input id="banner-en" name="bannerEn" value={draft.bannerEn} onChange={(event) => setDraft({ ...draft, bannerEn: event.target.value })} className="text-base" />
          </div>
          <div>
            <Label htmlFor="banner-es">Banner in Spanish (optional)</Label>
            <Input id="banner-es" name="bannerEs" value={draft.bannerEs} onChange={(event) => setDraft({ ...draft, bannerEs: event.target.value })} className="text-base" />
          </div>
          <div>
            <Label htmlFor="banner-pt">Banner in Portuguese (optional)</Label>
            <Input id="banner-pt" name="bannerPt" value={draft.bannerPt} onChange={(event) => setDraft({ ...draft, bannerPt: event.target.value })} className="text-base" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
            Turn this promotion on
          </label>
          <Notice state={promoState} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={promoPending || mode === "readonly"}>
              {promoPending ? "Saving…" : draft.id ? "Update promotion" : "Create promotion"}
            </Button>
            {draft.id ? (
              <Button type="button" variant="outline" onClick={() => setDraft(emptyPromo)}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
