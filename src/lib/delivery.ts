import { settings } from "@/lib/content";
import type { StudioLang } from "@/lib/studio-locale";
import { catalog, type DeliveryCopy, type LiveSettings, type TimingKey } from "@/lib/pricing";

export const DELIVERY_LOCALES = ["en", "es", "pt"] as const;
export type DeliveryLocale = (typeof DELIVERY_LOCALES)[number];

const TIMING_MAX = 40;
const DELIVERY_MAX = 240;

export const TIMING_FIELDS = [
  {
    key: "artistGalleryWeeks",
    token: "{artistWeeks}",
    label: "Photo galleries",
    hint: "Portraits, press kits, live sets and festival photo galleries",
  },
  {
    key: "artistFilmWeeks",
    token: "{artistFilmWeeks}",
    label: "Artist films and reels",
    hint: "Cards that use this phrase. A card with its own sentence, such as the music video, stays as written.",
  },
  {
    key: "elopementGalleryWeeks",
    token: "{weeks}",
    label: "Elopement photographs",
    hint: "The gallery time on elopement and small-wedding photos",
  },
  {
    key: "elopementFilmWeeks",
    token: "{filmWeeks}",
    label: "Elopement films",
    hint: "Elopement film and the small-wedding highlight",
  },
  {
    key: "expressPhotoDays",
    token: "{expressPhoto}",
    label: "Express photographs",
    hint: "The rushed photo phrase, such as ~7 days",
  },
  {
    key: "expressFilmDays",
    token: "{expressFilm}",
    label: "Express film",
    hint: "The rushed film phrase, such as 10–14 days",
  },
] as const satisfies readonly { key: TimingKey; token: string; label: string; hint: string }[];

const TOKEN_SOURCE = "\\{(?:baseArea|deposit|artistFilmWeeks|artistWeeks|filmWeeks|weeks|expressPhoto|expressFilm|languages|festivalFilmSpan)\\}";
const TIMING_TOKEN = /\{(?:artistFilmWeeks|artistWeeks|filmWeeks|weeks|expressPhoto|expressFilm)\}/;
const UNIT_WORD = "weeks|week|semanas|semana|days|day|días|día|dias|dia";

export type DeliverySpan = { min: number; max: number; unit: "weeks" | "days" };

function spanUnit(word: string): DeliverySpan["unit"] {
  return /day|d[ií]a/i.test(word) ? "days" : "weeks";
}

export function parseDeliveryRanges(line: string): DeliverySpan[] {
  const ranges: DeliverySpan[] = [];
  const ranged = new RegExp(`(\\d+)\\s*[–—-]\\s*(\\d+)\\s*(${UNIT_WORD})`, "gi");
  const written = new RegExp(`(\\d+)\\s+a\\s+(\\d+)\\s*(${UNIT_WORD})`, "gi");
  for (const match of line.matchAll(ranged)) {
    ranges.push({ min: Number(match[1]), max: Number(match[2]), unit: spanUnit(match[3]) });
  }
  for (const match of line.matchAll(written)) {
    ranges.push({ min: Number(match[1]), max: Number(match[2]), unit: spanUnit(match[3]) });
  }
  if (ranges.length > 0) return ranges;
  const single = new RegExp(`(\\d+)\\s*(${UNIT_WORD})`, "gi");
  for (const match of line.matchAll(single)) {
    const value = Number(match[1]);
    ranges.push({ min: value, max: value, unit: spanUnit(match[2]) });
  }
  return ranges;
}

function unitWord(locale: DeliveryLocale, unit: DeliverySpan["unit"], count: number) {
  if (unit === "days") {
    if (locale === "es") return count === 1 ? "día" : "días";
    if (locale === "pt") return count === 1 ? "dia" : "dias";
    return count === 1 ? "day" : "days";
  }
  if (locale === "en") return count === 1 ? "week" : "weeks";
  return count === 1 ? "semana" : "semanas";
}

export function formatDeliverySpan(
  locale: DeliveryLocale,
  min: number,
  max: number,
  unit: DeliverySpan["unit"],
  style: "dash" | "sentence" = "dash",
) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  if (style === "sentence" && locale === "es" && low !== high) {
    return `de ${low} a ${high} ${unitWord(locale, unit, high)}`;
  }
  if (low === high) return `${low} ${unitWord(locale, unit, low)}`;
  return `${low}–${high} ${unitWord(locale, unit, high)}`;
}

/** Localize a plain admin timing phrase. A custom sentence is kept as written. */
export function displayTiming(phrase: string, locale: DeliveryLocale) {
  const text = phrase.trim();
  if (locale === "en") return text;
  const tilde = text.startsWith("~");
  const body = (tilde ? text.slice(1) : text).trim().replace(/[—-]/g, "–").replace(/\s+/g, " ");
  const ranges = parseDeliveryRanges(body);
  if (ranges.length !== 1) return text;
  const [range] = ranges;
  if (body !== formatDeliverySpan("en", range.min, range.max, range.unit)) return text;
  const localized = formatDeliverySpan(locale, range.min, range.max, range.unit);
  return tilde ? `~${localized}` : localized;
}

const DELIVERED_LINE = /^(Delivered in|Entrega en|Entrega em)\b/;
const GALLERY_LINE = /^(Full gallery in|Gallery in|Galería completa|Galeria completa|Galería en|Galeria em)\b/;
const RUSH_LINE = /^(Ready in|Lista en|Pronto em|Both in|Las dos en|Os dois em)\b/;
const SECONDARY_RUSH = /on their own|solas pueden|sozinhas podem/i;
const HALF_USUAL = /half the usual|mitad del tiempo|metade do tempo/i;
const AS_SOON = /delivered as soon|con entrega|com entrega/i;
const NEXT_DAY = /selects the next day|selección al día siguiente|seleção no dia seguinte/i;
const SAME_DAY = /the same day, when the schedule|el mismo día, si la agenda|no próprio dia, quando a agenda/i;
const WEEKEND_PRIORITY = /Express or priority|exprés o prioritaria|expressa ou prioritária/i;

const localeName: Record<StudioLang, Record<DeliveryLocale, string>> = {
  en: { en: "English", es: "Spanish", pt: "Portuguese" },
  es: { en: "inglés", es: "español", pt: "portugués" },
};

const timingLabelEs: Record<TimingKey, string> = {
  artistGalleryWeeks: "Galerías de fotos",
  artistFilmWeeks: "Películas y reels",
  elopementGalleryWeeks: "Fotos de elopement",
  elopementFilmWeeks: "Películas de elopement",
  expressPhotoDays: "Fotos exprés",
  expressFilmDays: "Película exprés",
};

export function defaultTiming(key: TimingKey) {
  return settings[key];
}

export function buildTokenMap(timings?: Partial<Record<TimingKey, string>>) {
  const map: Record<string, string> = {
    "{baseArea}": settings.baseArea,
    "{deposit}": settings.depositPercent,
    "{languages}": settings.languagesSpoken,
  };
  for (const field of TIMING_FIELDS) {
    const custom = timings?.[field.key]?.trim();
    map[field.token] = custom || settings[field.key];
  }
  return map;
}

export function applyTokens(text: string, tokens: Record<string, string>) {
  return text.replace(new RegExp(TOKEN_SOURCE, "g"), (match) => tokens[match] ?? match);
}

export function splitTokenText(text: string) {
  return text.split(new RegExp(`(${TOKEN_SOURCE})`, "g"));
}

export function deliveryScore(line: string) {
  const text = line.trim();
  if (!text) return 0;
  if (DELIVERED_LINE.test(text)) return 100;
  if (GALLERY_LINE.test(text) || HALF_USUAL.test(text)) return 90;
  if (RUSH_LINE.test(text)) return 80;
  if (TIMING_TOKEN.test(text)) return SECONDARY_RUSH.test(text) ? 45 : 70;
  if (AS_SOON.test(text)) return 55;
  if (NEXT_DAY.test(text) || SAME_DAY.test(text) || WEEKEND_PRIORITY.test(text)) return 35;
  return 0;
}

export function deliveryLineIndex(items: readonly string[]) {
  let best = -1;
  let bestScore = 0;
  items.forEach((line, index) => {
    const score = deliveryScore(line);
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}

export function resolvePackageItems(items: readonly string[], override?: string) {
  const next = override?.trim();
  if (!next) return [...items];
  const index = deliveryLineIndex(items);
  if (index < 0) return [...items, next];
  if (items[index] === next) return [...items];
  return items.map((line, lineIndex) => (lineIndex === index ? next : line));
}

export function packageDelivery(deliveries: LiveSettings["deliveries"], id: string, locale: string) {
  if (locale !== "en" && locale !== "es" && locale !== "pt") return undefined;
  return deliveries?.[id]?.[locale];
}

export function readTimings(value: unknown): LiveSettings["timings"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const source = value as Record<string, unknown>;
  const timings: Partial<Record<TimingKey, string>> = {};
  for (const field of TIMING_FIELDS) {
    const raw = source[field.key];
    if (typeof raw !== "string") continue;
    const text = raw.trim();
    if (!text || text.length > 80) continue;
    timings[field.key] = text;
  }
  return Object.keys(timings).length > 0 ? timings : undefined;
}

export function readDeliveries(value: unknown): LiveSettings["deliveries"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const deliveries: NonNullable<LiveSettings["deliveries"]> = {};
  for (const [id, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!/^[a-z0-9-]+$/.test(id) || !entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const row: DeliveryCopy = {};
    for (const locale of DELIVERY_LOCALES) {
      const raw = (entry as Record<string, unknown>)[locale];
      if (typeof raw !== "string") continue;
      const text = raw.trim();
      if (!text || text.length > 300) continue;
      row[locale] = text;
    }
    if (Object.keys(row).length > 0) deliveries[id] = row;
  }
  return Object.keys(deliveries).length > 0 ? deliveries : undefined;
}

export function timingsFromForm(
  formData: FormData,
  lang: StudioLang = "es",
): { timings?: LiveSettings["timings"]; error?: string } {
  const timings: Partial<Record<TimingKey, string>> = {};
  for (const field of TIMING_FIELDS) {
    const raw = String(formData.get(`timing:${field.key}`) || "").trim();
    if (!raw || raw === settings[field.key]) continue;
    if (raw.length > TIMING_MAX || /[{}\r\n]/.test(raw)) {
      const label = lang === "en" ? field.label : timingLabelEs[field.key];
      const error =
        lang === "en"
          ? `Keep “${label}” to a short phrase, like “${settings[field.key]}”.`
          : `Deja «${label}» en una frase corta, como «${settings[field.key]}».`;
      return { error };
    }
    timings[field.key] = raw;
  }
  return { timings: Object.keys(timings).length > 0 ? timings : undefined };
}

export function deliveriesFromForm(
  formData: FormData,
  defaults: Record<string, Record<DeliveryLocale, string>>,
  lang: StudioLang = "es",
): { deliveries?: LiveSettings["deliveries"]; error?: string } {
  const deliveries: NonNullable<LiveSettings["deliveries"]> = {};
  for (const item of catalog) {
    const row: DeliveryCopy = {};
    for (const locale of DELIVERY_LOCALES) {
      const raw = String(formData.get(`delivery:${item.id}:${locale}`) || "").trim();
      const fallback = defaults[item.id]?.[locale] ?? "";
      if (!raw || raw === fallback) continue;
      if (raw.length > DELIVERY_MAX || /[\r\n]/.test(raw)) {
        return {
          error:
            lang === "en"
              ? `Shorten the ${localeName[lang][locale]} delivery line for ${item.label}.`
              : `Acorta el plazo en ${localeName[lang][locale]} de ${item.label}.`,
        };
      }
      row[locale] = raw;
    }
    if (Object.keys(row).length > 0) deliveries[item.id] = row;
  }
  return { deliveries: Object.keys(deliveries).length > 0 ? deliveries : undefined };
}
