"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, startTransition } from "react";
import { setStudioLanguage } from "@/app/admin/language-action";
import { studioCopy } from "@/lib/studio-copy";
import { STUDIO_LANG_COOKIE, type StudioLang } from "@/lib/studio-locale";

const StudioLangContext = createContext<StudioLang>("es");
const SetStudioLangContext = createContext<(lang: StudioLang) => void>(() => {});

export function StudioLangProvider({
  lang,
  children,
}: {
  lang: StudioLang;
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(lang);
  useEffect(() => setCurrent(lang), [lang]);
  return (
    <SetStudioLangContext.Provider value={setCurrent}>
      <StudioLangContext.Provider value={current}>{children}</StudioLangContext.Provider>
    </SetStudioLangContext.Provider>
  );
}

export function useStudioLang() {
  return useContext(StudioLangContext);
}

export function useStudioCopy() {
  return studioCopy(useStudioLang());
}

export function LanguageToggle() {
  const lang = useStudioLang();
  const setLang = useContext(SetStudioLangContext);
  const t = useStudioCopy();
  const router = useRouter();

  function choose(next: StudioLang) {
    if (next === lang) return;
    const previous = lang;
    setLang(next);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${STUDIO_LANG_COOKIE}=${next}; Path=/; Max-Age=34560000; SameSite=Lax${secure}`;
    startTransition(async () => {
      try {
        await setStudioLanguage(next);
        router.refresh();
      } catch {
        setLang(previous);
      }
    });
  }

  return (
    <div role="group" aria-label={t.language} className="inline-flex rounded-full bg-white/80 p-0.5 text-sm font-medium">
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
                ? "min-h-12 min-w-12 rounded-full bg-ink px-3 text-sand"
                : "min-h-12 min-w-12 rounded-full px-3 text-ink/70"
            }
          >
            {id === "es" ? "ES" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
