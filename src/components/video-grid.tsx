"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { readConsent } from "@/components/cookie-banner";
import { imageById, videos, type VideoItem } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const chrome = {
  en: { play: "Play", allow: "Allow video to play" },
  es: { play: "Reproducir", allow: "Acepta los vídeos para reproducir" },
  pt: { play: "Reproduzir", allow: "Aceita os vídeos para reproduzir" },
} as const;

function captionOf(video: VideoItem, locale: Locale) {
  return video.label[locale]?.trim() ?? "";
}

function posterAlt(video: VideoItem, locale: Locale) {
  const caption = captionOf(video, locale);
  if (caption) return caption;
  if (locale === "es") return "Película de Agota Urbikaite";
  if (locale === "pt") return "Filme de Agota Urbikaite";
  return "Film by Agota Urbikaite";
}

export function VideoGrid({
  locale,
  title,
  note,
  variant = "section",
  tone = "light",
}: {
  locale: Locale;
  title?: string;
  note?: string;
  /** section: festivals page block. plain: drop into an existing section. */
  variant?: "section" | "plain";
  tone?: "light" | "night";
}) {
  const [consent, setConsent] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const words = chrome[locale];
  const captionClass = tone === "night" ? "mt-3 text-sm text-sand/60" : "mt-3 text-sm text-ink/60";

  useEffect(() => {
    const sync = () => {
      const allowed = Boolean(readConsent()?.embeds);
      setConsent(allowed);
      if (!allowed) setActive(null);
    };
    sync();
    window.addEventListener("oof-consent", sync);
    return () => window.removeEventListener("oof-consent", sync);
  }, []);

  const grid = (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
      {videos.items.map((video) => {
        const poster = imageById(video.posterId);
        const caption = captionOf(video, locale);
        const alt = posterAlt(video, locale);
        const wide = video.platform === "youtube";
        const playing = wide && active === video.id && consent;
        const youtubeSrc =
          video.youtubeId != null
            ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`
            : "";

        return (
          <figure key={video.id} className={cn(wide && "sm:col-span-2 xl:col-span-4")}>
            {playing ? (
              <iframe
                title={alt}
                src={youtubeSrc}
                className="aspect-video w-full rounded-3xl bg-night"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : wide && consent ? (
              <button
                type="button"
                className="relative block w-full overflow-hidden rounded-3xl text-left"
                onClick={() => setActive(video.id)}
              >
                <Poster poster={poster} alt={alt} wide />
                <PlayPill>{words.play}</PlayPill>
              </button>
            ) : (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block overflow-hidden rounded-3xl"
              >
                <Poster poster={poster} alt={alt} wide={wide} />
                <PlayPill>{wide ? words.allow : words.play}</PlayPill>
              </a>
            )}
            {caption ? <figcaption className={captionClass}>{caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );

  if (variant === "plain") return grid;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      {title ? <h2 className="font-serif text-4xl">{title}</h2> : null}
      {note ? (
        <p className={cn("mt-3 max-w-2xl text-sm", tone === "night" ? "text-sand/70" : "text-ink/70")}>{note}</p>
      ) : null}
      <div className={title || note ? "mt-8" : undefined}>{grid}</div>
    </section>
  );
}

function Poster({
  poster,
  alt,
  wide,
}: {
  poster: { src: string; width: number; height: number };
  alt: string;
  wide: boolean;
}) {
  return (
    <Image
      src={poster.src}
      alt={alt}
      width={poster.width}
      height={poster.height}
      sizes={wide ? "(max-width: 1152px) 100vw, 1152px" : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"}
      className={cn("w-full bg-night object-cover", wide ? "aspect-video" : "aspect-[9/16]")}
    />
  );
}

function PlayPill({ children }: { children: string }) {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="rounded-full bg-sand px-4 py-2 text-sm text-ink">{children}</span>
    </span>
  );
}
