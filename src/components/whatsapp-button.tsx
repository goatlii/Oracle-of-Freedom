"use client";

import { settings, whatsappHref } from "@/lib/content";
import { messageWithPromo, useRememberedPromoCode, useRememberedWish } from "@/components/whatsapp-link";

export function WhatsAppButton({
  label,
  text,
  codeLabel,
  wishLabel,
}: {
  label: string;
  text: string;
  codeLabel: string;
  wishLabel?: string;
}) {
  const code = useRememberedPromoCode();
  const wish = useRememberedWish();
  return (
    <a
      href={whatsappHref(messageWithPromo(text, codeLabel, code, wishLabel, wish))}
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a4d] text-white shadow-lg hover:bg-[#18663f] md:right-6 md:bottom-6"
      aria-label={label}
      data-placeholder={settings.whatsappIsPlaceholder ? "true" : undefined}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="currentColor">
        <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.8.7.7-3.7-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    </a>
  );
}
