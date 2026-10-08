import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  googleAuthorizationUrl,
  googleOAuthConfigured,
} from "@/lib/google-calendar";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }
  if (!googleOAuthConfigured()) {
    return NextResponse.redirect(new URL("/admin/calendar?google=missing", origin));
  }
  const state = randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(googleAuthorizationUrl(state));
  response.cookies.set("oof_google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
