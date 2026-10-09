"use server";

import { cookies } from "next/headers";
import { STUDIO_LANG_COOKIE, parseStudioLang } from "@/lib/studio-locale";

export async function setStudioLanguage(value: string) {
  const lang = parseStudioLang(value);
  const jar = await cookies();
  jar.set(STUDIO_LANG_COOKIE, lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
