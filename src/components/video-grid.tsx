"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { readConsent } from "@/components/cookie-banner";
import { imageById, videos } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function VideoGrid({
  locale,
  title,
  note,
  play,
  allow,
}: {
  locale: Locale;
  title: string;
  note: string;
  play: string;
  allow: string;
}) {
  const [consent, setConsent] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setConsent(Boolean(readConsent()?.embeds));
    sync();
    window.addEventListener("oof-consent", sync);
    return () => window.removeEventListener("oof-consent", sync);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-serif text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-sand/70">{note}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {videos.items.map((video) => {
          const poster = imageById(video.posterId);
          const playing = active === video.id && consent;
          const src =
            video.platform === "youtube" && video.youtubeId
              ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`
              : `${video.url.replace(/\/$/, "")}/embed`;
          return (
            <article key={video.id} className="overflow-hidden rounded-3xl bg-night">
              {playing ? (
                <iframe
                  title={poster.alt[locale]}
                  src={src}
                  className="aspect-video w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="relative block w-full text-left"
                  onClick={() => {
                    if (!consent) return;
                    setActive(video.id);
                  }}
                >
                  <Image
                    src={poster.src}
                    alt={poster.alt[locale]}
                    width={poster.width}
                    height={poster.height}
                    className="aspect-video w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-sand px-4 py-2 text-sm text-ink">
                      {consent ? play : allow}
                    </span>
                  </span>
                </button>
              )}
              <p className="px-4 py-3 text-xs text-sand/60">
                {video.platform === "youtube" ? "YouTube" : "Instagram"}
                {video.verify ? " · PLACEHOLDER match" : ""} ·{" "}
                <a href={video.url} className="underline" rel="noopener noreferrer">
                  {video.url.replace("https://www.", "")}
                </a>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
