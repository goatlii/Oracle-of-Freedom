import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

const BOT =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|lighthouse|pagespeed|headless|embedly|quora|pinterest|vkshare|w3c_validator/i;

function preferredLocale(header: string | null): "en" | "es" | "pt" {
  if (!header) return "en";
  const parts = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase() ?? "");
  for (const part of parts) {
    if (part.startsWith("pt")) return "pt";
    if (part.startsWith("es")) return "es";
    if (part.startsWith("en")) return "en";
  }
  return "en";
}

function withLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isBot = BOT.test(request.headers.get("user-agent") || "");
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;

  if (!isBot && pathname === "/") {
    const locale =
      cookie === "es" || cookie === "pt" || cookie === "en"
        ? cookie
        : preferredLocale(request.headers.get("accept-language"));

    if (locale !== "en") {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      const redirect = NextResponse.redirect(url);
      if (cookie !== locale) return withLocaleCookie(redirect, locale);
      return redirect;
    }

    const response = handleI18n(request);
    if (cookie !== "en") return withLocaleCookie(response, "en");
    return response;
  }

  return handleI18n(request);
}

export const config = {
  matcher: ["/((?!api|keystatic|admin|_next|_vercel|.*\\..*).*)"],
};
