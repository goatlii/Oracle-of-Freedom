"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const KEY = "oof-consent";

export type Consent = { necessary: true; embeds: boolean };

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function allowEmbeds() {
  if (typeof window === "undefined" || readConsent()?.embeds) return;
  localStorage.setItem(KEY, JSON.stringify({ necessary: true, embeds: true }));
  window.dispatchEvent(new Event("oof-consent"));
}

export function CookieBanner({
  text,
  accept,
  essential,
  privacy,
}: {
  text: string;
  accept: string;
  essential: string;
  privacy: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(readConsent() == null);
    const frame = window.requestAnimationFrame(sync);
    window.addEventListener("oof-consent", sync);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("oof-consent", sync);
    };
  }, []);

  if (!visible) return null;

  function save(embeds: boolean) {
    localStorage.setItem(KEY, JSON.stringify({ necessary: true, embeds }));
    window.dispatchEvent(new Event("oof-consent"));
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-3 bottom-20 z-40 rounded-3xl border border-ink/10 bg-sand p-4 shadow-xl md:inset-x-auto md:right-24 md:bottom-6 md:max-w-md">
      <p className="text-sm text-ink/80">{text}</p>
      <p className="mt-2 text-sm">
        <Link href="/privacy" className="text-terracotta-ink underline underline-offset-4">
          {privacy}
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => save(true)}>
          {accept}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => save(false)}>
          {essential}
        </Button>
      </div>
    </div>
  );
}
