import { getCopy } from "@/content";
import {
  applyTokens,
  buildTokenMap,
  deliveryLineIndex,
  DELIVERY_LOCALES,
  displayTiming,
  formatDeliverySpan,
  packageDelivery,
  parseDeliveryRanges,
  type DeliveryLocale,
  type DeliverySpan,
} from "@/lib/delivery";
import { catalog, type LiveSettings } from "@/lib/pricing";

export type DeliveryDefaults = Record<string, Record<DeliveryLocale, string>>;

export function packageItemsFor(locale: DeliveryLocale, id: string) {
  const copy = getCopy(locale);
  const services = [copy.portraits, copy.elopements, copy.retreats, copy.festivals, copy.places];
  for (const service of services) {
    const pack = service.packages[id];
    if (pack) return pack.items;
  }
  return undefined;
}

function filmPackages(prices: LiveSettings["prices"] | undefined) {
  return catalog.filter((item) => {
    if (item.group !== "festivals" || item.kind !== "video") return false;
    return prices?.[item.id]?.visible !== false;
  });
}

/** Shortest-to-longest span of the festival film delivery lines the admin can edit. */
export function festivalFilmSpan(
  locale: DeliveryLocale,
  settings: Pick<LiveSettings, "timings" | "deliveries" | "prices">,
): string {
  const tokens = buildTokenMap(settings.timings);
  const ranges: DeliverySpan[] = [];
  for (const item of filmPackages(settings.prices)) {
    const items = packageItemsFor(locale, item.id);
    if (!items) continue;
    const index = deliveryLineIndex(items);
    if (index < 0) continue;
    const override = packageDelivery(settings.deliveries, item.id, locale)?.trim();
    const line = override || items[index];
    ranges.push(...parseDeliveryRanges(applyTokens(line, tokens)));
  }
  const weeks = ranges.filter((range) => range.unit === "weeks");
  const chosen = weeks.length > 0 ? weeks : ranges.filter((range) => range.unit === "days");
  if (chosen.length === 0) return displayTiming(tokens["{artistFilmWeeks}"] ?? "", locale);
  const min = Math.min(...chosen.map((range) => range.min));
  const max = Math.max(...chosen.map((range) => range.max));
  return formatDeliverySpan(locale, min, max, chosen[0].unit, "sentence");
}

export function deliveryDefaults(): DeliveryDefaults {
  const defaults: DeliveryDefaults = {};
  for (const item of catalog) {
    defaults[item.id] = { en: "", es: "", pt: "" };
    for (const locale of DELIVERY_LOCALES) {
      const items = packageItemsFor(locale, item.id);
      if (!items) continue;
      const index = deliveryLineIndex(items);
      defaults[item.id][locale] = index < 0 ? "" : items[index];
    }
  }
  return defaults;
}
