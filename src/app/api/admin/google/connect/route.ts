import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { readCalendarConfig } from "@/lib/calendar-config-store";
import {
  googleAppFromConfig,
  googleAuthorizationUrl,
} from "@/lib/google-calendar";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }
  const app = googleAppFromConfig(await readCalendarConfig());
  if (!app) {
    return NextResponse.redirect(new URL("/admin/calendar?google=missing", origin));
  }
  const state = randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(googleAuthorizationUrl(state, app));
  response.cookies.set("oof_google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
