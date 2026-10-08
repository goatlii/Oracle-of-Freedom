import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  exchangeGoogleCode,
  googleAppFromConfig,
  initialGoogleConnection,
} from "@/lib/google-calendar";
import {
  readCalendarConfig,
  writeCalendarConfig,
} from "@/lib/calendar-config-store";

function sameState(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const currentUrl = new URL(request.url);
  const returnUrl = new URL("/admin/calendar", currentUrl.origin);
  const jar = await cookies();
  const expected = jar.get("oof_google_oauth_state")?.value || "";
  jar.delete("oof_google_oauth_state");
  const state = currentUrl.searchParams.get("state") || "";
  const code = currentUrl.searchParams.get("code") || "";

  if (!(await isAdmin()) || !state || !sameState(state, expected) || !code) {
    returnUrl.searchParams.set("google", "error");
    return NextResponse.redirect(returnUrl);
  }

  try {
    const config = await readCalendarConfig();
    const app = googleAppFromConfig(config);
    if (!app) throw new Error("Google Calendar credentials are not configured.");
    const tokens = await exchangeGoogleCode(code, app);
    if (!tokens.refresh_token || !tokens.access_token) {
      throw new Error("Google did not return a refresh token.");
    }
    const connection = await initialGoogleConnection(
      tokens.refresh_token,
      tokens.access_token,
    );
    await writeCalendarConfig({ ...config, google: connection });
    returnUrl.searchParams.set("google", "connected");
  } catch (error) {
    console.error("[calendar] Google OAuth callback failed", error);
    returnUrl.searchParams.set("google", "error");
  }
  return NextResponse.redirect(returnUrl);
}
