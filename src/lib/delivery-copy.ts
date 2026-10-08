import { getCopy } from "@/content";
import { deliveryLineIndex, DELIVERY_LOCALES, type DeliveryLocale } from "@/lib/delivery";
import { catalog } from "@/lib/pricing";

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
