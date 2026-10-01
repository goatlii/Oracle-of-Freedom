import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "oof_admin";
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

function password() {
  return process.env.ADMIN_PASSWORD || "";
}

export function adminConfigured() {
  return password().length > 0;
}

function digest(value: string) {
  return createHmac("sha256", "oracle-of-freedom").update(value).digest();
}

export function passwordsMatch(input: string, expected: string) {
  return timingSafeEqual(digest(input), digest(expected));
}

export function sealSession(now = Date.now()) {
  const secret = password();
  const exp = now + TWO_WEEKS;
  const body = `v1.${exp}`;
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function sessionValid(token: string | undefined, now = Date.now()) {
  const secret = password();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const body = `${parts[0]}.${parts[1]}`;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const left = Buffer.from(parts[2]);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  const exp = Number(parts[1]);
  return Number.isFinite(exp) && exp > now;
}

export async function isAdmin() {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TWO_WEEKS / 1000,
  };
}
