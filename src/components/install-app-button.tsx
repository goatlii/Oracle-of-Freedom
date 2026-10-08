"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function runningAsApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches
  );
}

export function InstallAppButton() {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [promptEvent, setPromptEvent] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [hint, setHint] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setInstalled(runningAsApp());
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPrompt);
      setHint("");
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const media = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      media.removeEventListener("change", apply);
    };
  }, []);

  const inFooter = narrow && pathname !== "/admin/login";

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || installed || !inFooter) {
      document.documentElement.style.setProperty("--studio-install-gap", "0px");
      return;
    }
    const apply = () => {
      document.documentElement.style.setProperty("--studio-install-gap", `${button.offsetWidth + 20}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(button);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--studio-install-gap", "0px");
    };
  }, [installed, inFooter, pending]);

  if (installed) return null;

  async function install() {
    if (!promptEvent) {
      setHint("En Chrome, abre el menú ⋮ y pulsa Instalar app.");
      return;
    }
    setPending(true);
    setHint("");
    const event = promptEvent;
    setPromptEvent(null);
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      setHint("En Chrome, abre el menú ⋮ y pulsa Instalar app.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed right-3 z-[45] flex flex-col items-end"
      style={{
        bottom: inFooter
          ? "max(0.35rem, env(safe-area-inset-bottom))"
          : "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      {hint ? (
        <p className="mb-2 w-56 rounded-2xl bg-ink px-3 py-2 text-sm text-sand shadow" role="status">
          {hint}
        </p>
      ) : null}
      <button
        ref={buttonRef}
        type="button"
        onClick={install}
        disabled={pending}
        className="min-h-11 rounded-full bg-terracotta px-4 text-sm font-medium text-white shadow-md"
      >
        {pending ? "Instalando…" : "Instalar la app"}
      </button>
    </div>
  );
}
