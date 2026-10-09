"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import { studioCopy } from "@/lib/studio-copy";
import { STUDIO_LANG_COOKIE, type StudioLang } from "@/lib/studio-locale";

const StudioLangContext = createContext<StudioLang>("es");

export function StudioLangProvider({
  lang,
  children,
}: {
  lang: StudioLang;
  children: React.ReactNode;
}) {
  return <StudioLangContext.Provider value={lang}>{children}</StudioLangContext.Provider>;
}

export function useStudioLang() {
  return useContext(StudioLangContext);
}

export function useStudioCopy() {
  return studioCopy(useStudioLang());
}

export function LanguageToggle() {
  const lang = useStudioLang();
  const t = useStudioCopy();
  const router = useRouter();

  function choose(next: StudioLang) {
    if (next === lang) return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${STUDIO_LANG_COOKIE}=${next}; Path=/; Max-Age=34560000; SameSite=Lax${secure}`;
    router.refresh();
  }

  return (
    <div role="group" aria-label={t.language} className="inline-flex rounded-full bg-white/80 p-0.5 text-xs font-medium">
      {(["es", "en"] as const).map((id) => {
        const active = lang === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => choose(id)}
            className={
              active
                ? "min-h-8 rounded-full bg-ink px-2.5 text-sand"
                : "min-h-8 rounded-full px-2.5 text-ink/70"
            }
          >
            {id === "es" ? "ES" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
