"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStudioCopy } from "@/components/studio-lang";

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
  const t = useStudioCopy();
  const pathname = usePathname();
  const stripRef = useRef<HTMLDivElement>(null);
  const [promptEvent, setPromptEvent] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [hint, setHint] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setInstalled(runningAsApp());
    const remembered = (window as Window & { __oofInstall?: InstallPrompt | null }).__oofInstall;
    if (remembered) setPromptEvent(remembered);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      const prompt = event as InstallPrompt;
      (window as Window & { __oofInstall?: InstallPrompt | null }).__oofInstall = prompt;
      setPromptEvent(prompt);
      setHint("");
    };
    const onReady = () => {
      const saved = (window as Window & { __oofInstall?: InstallPrompt | null }).__oofInstall;
      if (saved) {
        setPromptEvent(saved);
        setHint("");
      }
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      (window as Window & { __oofInstall?: InstallPrompt | null }).__oofInstall = null;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("oof-install", onReady);
    window.addEventListener("appinstalled", onInstalled);
    const media = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("oof-install", onReady);
      window.removeEventListener("appinstalled", onInstalled);
      media.removeEventListener("change", apply);
    };
  }, []);

  const strip = narrow && pathname !== "/admin/login" && !installed;

  useEffect(() => {
    const node = stripRef.current;
    if (!strip || !node) {
      document.body.style.setProperty("--studio-install", "0px");
      return;
    }
    const apply = () => {
      document.body.style.setProperty("--studio-install", `${node.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.body.style.setProperty("--studio-install", "0px");
    };
  }, [strip, hint, pending]);

  if (installed) return null;

  function install() {
    const event =
      promptEvent || (window as Window & { __oofInstall?: InstallPrompt | null }).__oofInstall || null;
    if (!event) {
      setHint(t.installHint);
      return;
    }
    setPending(true);
    setHint("");
    setPromptEvent(null);
    (window as Window & { __oofInstall?: InstallPrompt | null }).__oofInstall = null;
    event
      .prompt()
      .then(() => event.userChoice)
      .then((choice) => {
        if (choice.outcome === "accepted") setInstalled(true);
      })
      .catch(() => setHint(t.installHint))
      .finally(() => setPending(false));
  }

  if (strip) {
    return (
      <div
        ref={stripRef}
        className="fixed inset-x-0 z-[45] border-t border-ink/10 bg-sand/95 px-3 py-1.5"
        style={{ bottom: "var(--studio-nav)" }}
      >
        {hint ? (
          <p className="mb-2 rounded-2xl bg-ink px-3 py-2 text-center text-sm text-sand" role="status">
            {hint}
          </p>
        ) : null}
        <button
          type="button"
          onClick={install}
          disabled={pending}
          className="min-h-12 w-full rounded-full bg-terracotta text-sm font-medium text-white"
        >
          {pending ? t.installing : t.install}
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed right-3 z-[45] flex flex-col items-end"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {hint ? (
        <p className="mb-2 w-56 rounded-2xl bg-ink px-3 py-2 text-sm text-sand shadow" role="status">
          {hint}
        </p>
      ) : null}
      <button
        type="button"
        onClick={install}
        disabled={pending}
        className="min-h-12 rounded-full bg-terracotta px-4 text-sm font-medium text-white shadow-md"
      >
        {pending ? t.installing : t.install}
      </button>
    </div>
  );
}
