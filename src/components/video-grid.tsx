"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { allowEmbeds, readConsent } from "@/components/cookie-banner";
import { MobileMore } from "@/components/mobile-more";
import { imageById, videos, type VideoItem } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const chrome = {
  en: {
    play: "Play video",
    youtube: "Plays from YouTube",
    instagram: "Plays from Instagram",
    more: "View more films",
    less: "Show less",
  },
  es: {
    play: "Reproducir vídeo",
    youtube: "Se reproduce desde YouTube",
    instagram: "Se reproduce desde Instagram",
    more: "Ver más vídeos",
    less: "Ver menos",
  },
  pt: {
    play: "Reproduzir vídeo",
    youtube: "Reproduz a partir do YouTube",
    instagram: "Reproduz a partir do Instagram",
    more: "Ver mais filmes",
    less: "Ver menos",
  },
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
  foldMobile,
}: {
  locale: Locale;
  title?: string;
  note?: string;
  /** section: festivals page block. plain: drop into an existing section. */
  variant?: "section" | "plain";
  tone?: "light" | "night";
  /** Collapse after the first film below md. Section blocks fold unless this is false. */
  foldMobile?: boolean;
}) {
  const [consent, setConsent] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const words = chrome[locale];
  const captionClass = tone === "night" ? "mt-3 text-sm text-sand/60" : "mt-3 text-sm text-ink/60";
  const fold = (foldMobile ?? variant === "section") && videos.items.length > 1;

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

  const grid = ({
    hide,
    itemId,
  }: {
    hide: (index: number) => boolean;
    itemId: (index: number) => string | undefined;
  }) => (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
      {videos.items.map((video, index) => {
        const poster = imageById(video.posterId);
        const caption = captionOf(video, locale);
        const alt = posterAlt(video, locale);
        const wide = video.platform === "youtube";
        const embedSrc = wide
          ? video.youtubeId
            ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`
            : ""
          : video.embedUrl;
        const canEmbed = Boolean(embedSrc);
        const playing = canEmbed && active === video.id && consent;
        const play = () => {
          allowEmbeds();
          setConsent(true);
          setActive(video.id);
        };

        return (
          <figure
            key={video.id}
            id={itemId(index)}
            className={cn(wide && "sm:col-span-2 xl:col-span-4", hide(index) && "max-md:hidden")}
          >
            {playing ? (
              <iframe
                title={alt}
                src={embedSrc}
                className={cn("w-full rounded-3xl bg-night", wide ? "aspect-video" : "aspect-[9/16]")}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : canEmbed ? (
              <button
                type="button"
                aria-label={words.play}
                className="relative block w-full overflow-hidden rounded-3xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                onClick={play}
              >
                <Poster poster={poster} alt="" wide={wide} />
                <PlayMark note={consent ? undefined : wide ? words.youtube : words.instagram} />
              </button>
            ) : (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={words.play}
                className="relative block overflow-hidden rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Poster poster={poster} alt="" wide={wide} />
                <PlayMark />
              </a>
            )}
            {caption ? <figcaption className={captionClass}>{caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );

  const films = (
    <MobileMore
      enabled={fold}
      total={videos.items.length}
      visible={1}
      more={words.more}
      less={words.less}
      tone={tone}
    >
      {grid}
    </MobileMore>
  );

  if (variant === "plain") return films;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      {title ? <h2 className="font-serif text-4xl">{title}</h2> : null}
      {note ? (
        <p className={cn("mt-3 max-w-2xl text-sm", tone === "night" ? "text-sand/70" : "text-ink/70")}>{note}</p>
      ) : null}
      <div className={title || note ? "mt-8" : undefined}>{films}</div>
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

function PlayMark({ note }: { note?: string }) {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-night/25">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-ink shadow-[0_8px_30px_rgba(42,24,16,0.28)]">
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" aria-hidden="true">
          <path fill="currentColor" d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.14-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
        </svg>
      </span>
      {note ? <span className="absolute inset-x-3 bottom-3 text-center text-[11px] leading-tight text-sand">{note}</span> : null}
    </span>
  );
}
