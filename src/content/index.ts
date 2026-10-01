import type { Locale } from "@/i18n/routing";
import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import type { Copy } from "./types";

const copies: Record<Locale, Copy> = { en, es, pt };

export function getCopy(locale: string): Copy {
  if (locale === "es" || locale === "pt") return copies[locale];
  return en;
}

export type { Copy };
