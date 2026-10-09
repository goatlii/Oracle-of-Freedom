export const STUDIO_LANG_COOKIE = "oof_studio_lang";

export type StudioLang = "en" | "es";

export function parseStudioLang(value: string | undefined | null): StudioLang {
  return value === "en" ? "en" : "es";
}
