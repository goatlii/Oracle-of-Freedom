import { cookies } from "next/headers";
import { studioCopy } from "@/lib/studio-copy";
import { STUDIO_LANG_COOKIE, parseStudioLang } from "@/lib/studio-locale";

export async function studioLang() {
  const jar = await cookies();
  return parseStudioLang(jar.get(STUDIO_LANG_COOKIE)?.value);
}

export async function studioT() {
  return studioCopy(await studioLang());
}
