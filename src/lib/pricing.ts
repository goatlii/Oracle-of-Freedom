import packagesJson from "../../content/packages.json";

export type CatalogItem = {
  id: string;
  group: string;
  kind: "photo" | "video" | "combo" | "addon";
  label: string;
  from?: number;
  unit?: "day" | "night" | "month";
  inquiry: string;
  loved?: boolean;
  custom?: boolean;
  compare?: string[];
  personalize?: boolean;
};

export type Promo = {
  id: string;
  name: string;
  type: "percent" | "fixed";
  amount: number;
  targets: "all" | string[];
  starts: string;
  ends: string;
  code: string;
  banner: { en: string; es: string; pt: string };
  active: boolean;
};

export type LiveSettings = {
  prices: Record<string, { from?: number; visible: boolean }>;
  promos: Promo[];
};

export type StorageMode = "blob" | "local" | "readonly";

export type PricedPackage = CatalogItem & {
  visible: boolean;
  listFrom?: number;
  promoFrom?: number;
  promoName?: string;
  save?: number;
};

export const catalog = packagesJson.items as CatalogItem[];

export function lisbonToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function promoStatus(promo: Promo, today = lisbonToday()): "live" | "scheduled" | "ended" | "off" {
  if (!promo.active) return "off";
  if (promo.starts && today < promo.starts) return "scheduled";
  if (promo.ends && today > promo.ends) return "ended";
  return "live";
}

export function isLive(promo: Promo, today = lisbonToday()) {
  return promoStatus(promo, today) === "live";
}

function applies(promo: Promo, id: string) {
  return promo.targets === "all" || promo.targets.includes(id);
}

export function discounted(price: number, promo: Promo) {
  if (promo.type === "percent") {
    const rate = Math.min(Math.max(promo.amount, 0), 100) / 100;
    return Math.max(0, Math.round(price * (1 - rate)));
  }
  return Math.max(0, Math.round(price - promo.amount));
}

export function priceMap(settings: LiveSettings) {
  const map = new Map<string, number | undefined>();
  for (const item of catalog) {
    const override = settings.prices[item.id];
    map.set(item.id, override?.from ?? item.from);
  }
  return map;
}

export function mergeCatalog(settings: LiveSettings, today = lisbonToday()): PricedPackage[] {
  const lists = priceMap(settings);
  const live = settings.promos.filter((promo) => isLive(promo, today));
  return catalog.map((item) => {
    const override = settings.prices[item.id];
    const listFrom = lists.get(item.id);
    const visible = override?.visible ?? true;
    let promoFrom: number | undefined;
    let promoName: string | undefined;
    if (listFrom != null) {
      for (const promo of live) {
        if (!applies(promo, item.id)) continue;
        const next = discounted(listFrom, promo);
        if (next < listFrom && (promoFrom == null || next < promoFrom)) {
          promoFrom = next;
          promoName = promo.name;
        }
      }
    }
    let save: number | undefined;
    if (item.compare?.length && listFrom != null) {
      const parts = item.compare.map((id) => lists.get(id));
      if (parts.every((price) => price != null)) {
        const separate = parts.reduce<number>((sum, price) => sum + (price ?? 0), 0);
        if (separate > listFrom) save = separate - listFrom;
      }
    }
    return { ...item, from: listFrom, visible, listFrom, promoFrom, promoName, save };
  });
}

export function openingPrice(items: PricedPackage[], group: string) {
  const item = items.find((entry) => entry.group === group && entry.kind === "photo" && entry.visible && entry.listFrom != null);
  if (!item || item.listFrom == null) return undefined;
  return item.promoFrom ?? item.listFrom;
}

export function hasPromoCode(settings: LiveSettings, today = lisbonToday()) {
  return settings.promos.some((promo) => isLive(promo, today) && promo.code.trim());
}

export function liveBanners(settings: LiveSettings, today = lisbonToday()) {
  return settings.promos.filter((promo) => isLive(promo, today) && (promo.banner.en || promo.banner.es || promo.banner.pt));
}
