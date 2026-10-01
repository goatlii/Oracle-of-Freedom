"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/lib/content";

export const PROMO_CODE_KEY = "oof-promo";
export const WISH_KEY = "oof-wish";

export function rememberPromoCode(code: string) {
  const value = code.trim();
  if (value) sessionStorage.setItem(PROMO_CODE_KEY, value);
  else sessionStorage.removeItem(PROMO_CODE_KEY);
  window.dispatchEvent(new Event(PROMO_CODE_KEY));
}

export function rememberWish(wish: string) {
  const value = wish.trim();
  if (value) sessionStorage.setItem(WISH_KEY, value);
  else sessionStorage.removeItem(WISH_KEY);
  window.dispatchEvent(new Event(WISH_KEY));
}

export function useRememberedPromoCode() {
  const [code, setCode] = useState("");
  useEffect(() => {
    const read = () => setCode(sessionStorage.getItem(PROMO_CODE_KEY) || "");
    read();
    window.addEventListener(PROMO_CODE_KEY, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(PROMO_CODE_KEY, read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return code;
}

export function useRememberedWish() {
  const [wish, setWish] = useState("");
  useEffect(() => {
    const read = () => setWish(sessionStorage.getItem(WISH_KEY) || "");
    read();
    window.addEventListener(WISH_KEY, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(WISH_KEY, read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return wish;
}

export function messageWithPromo(text: string, codeLabel: string, code: string, wishLabel?: string, wish = "") {
  const parts = [text];
  if (wishLabel && wish.trim()) parts.push(`${wishLabel}: ${wish.trim()}`);
  if (code.trim()) parts.push(`${codeLabel}: ${code.trim()}`);
  return parts.join("\n\n");
}

export function WhatsAppLink({
  text,
  codeLabel,
  wishLabel,
  className,
  children,
  ariaLabel,
}: {
  text: string;
  codeLabel: string;
  wishLabel?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const code = useRememberedPromoCode();
  const wish = useRememberedWish();
  return (
    <a href={whatsappHref(messageWithPromo(text, codeLabel, code, wishLabel, wish))} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
