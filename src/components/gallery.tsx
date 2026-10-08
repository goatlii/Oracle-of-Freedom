"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { MobileMore } from "@/components/mobile-more";
import type { GalleryImage } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { cn, isPublishedPhoto } from "@/lib/utils";

const moreCopy = {
  en: { more: "View more photos", less: "Show less" },
  es: { more: "Ver más fotos", less: "Ver menos" },
  pt: { more: "Ver mais fotos", less: "Ver menos" },
} as const;

export function GalleryGrid({
  images,
  locale,
  labels,
  foldMobile = false,
}: {
  images: GalleryImage[];
  locale: Locale;
  labels: { open: string; close: string; previous: string; next: string; placeholder: string };
  /** Below md, show the first three photos and a button that reveals the rest. */
  foldMobile?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const photos = images.filter((image) => isPublishedPhoto(image));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active == null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [active]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (active == null) return;
      if (event.key === "ArrowRight") {
        setActive((index) => (index == null ? index : (index + 1) % photos.length));
      }
      if (event.key === "ArrowLeft") {
        setActive((index) =>
          index == null ? index : (index - 1 + photos.length) % photos.length,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, photos.length]);

  const current = active == null ? null : photos[active];

  const words = moreCopy[locale];

  return (
    <>
      <MobileMore enabled={foldMobile} total={photos.length} visible={3} more={words.more} less={words.less}>
        {({ hide, itemId }) => (
          <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
            {photos.map((image, index) => (
              <button
                key={image.id}
                id={itemId(index)}
                type="button"
                className={cn(
                  "group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left",
                  hide(index) && "max-md:hidden",
                )}
                onClick={() => setActive(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={image.blur}
                  className="h-auto w-full transition duration-700 group-hover:scale-[1.02]"
                />
                <span className="sr-only">{labels.open}</span>
              </button>
            ))}
          </div>
        )}
      </MobileMore>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto max-h-[100dvh] max-w-[100vw] bg-transparent p-0 backdrop:bg-night/85"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setActive(null);
        }}
      >
        {current ? (
          <div className="relative flex max-h-[100dvh] max-w-[100vw] items-center justify-center p-3 md:p-8">
            <p id={titleId} className="sr-only">
              {current.alt[locale]}
            </p>
            <Image
              src={current.src}
              alt={current.alt[locale]}
              width={current.width}
              height={current.height}
              className="max-h-[82dvh] w-auto max-w-[92vw] rounded-xl object-contain"
              sizes="92vw"
              priority
            />
            <button
              type="button"
              className="absolute top-4 right-4 rounded-full bg-sand px-4 py-2 text-sm text-ink"
              onClick={() => setActive(null)}
            >
              {labels.close}
            </button>
            <button
              type="button"
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-sand px-3 py-2 text-sm"
              onClick={() =>
                setActive((index) =>
                  index == null ? index : (index - 1 + photos.length) % photos.length,
                )
              }
            >
              {labels.previous}
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-sand px-3 py-2 text-sm"
              onClick={() =>
                setActive((index) => (index == null ? index : (index + 1) % photos.length))
              }
            >
              {labels.next}
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
