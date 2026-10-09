import { NextResponse } from "next/server";
import { STUDIO_LANG_COOKIE, parseStudioLang } from "@/lib/studio-locale";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const lang = parseStudioLang(jar.get(STUDIO_LANG_COOKIE)?.value);
  const english = lang === "en";
  const manifest = {
    name: english ? "Studio · Oracle of Freedom" : "Estudio · Oracle of Freedom",
    short_name: english ? "Studio" : "Estudio",
    description: english
      ? "Inquiries, calendar and prices for Oracle of Freedom."
      : "Solicitudes, agenda y precios de Oracle of Freedom.",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#f4ece1",
    theme_color: "#f4ece1",
    lang,
    id: "/admin",
    icons: [
      { src: "/studio/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/studio/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/studio/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "private, no-cache",
      Vary: "Cookie",
    },
  });
}
