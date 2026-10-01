"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function GalleryGrid({
  images,
  locale,
  labels,
}: {
  images: GalleryImage[];
  locale: Locale;
  labels: { open: string; close: string; previous: string; next: string; placeholder: string };
}) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
        setActive((index) => (index == null ? index : (index + 1) % images.length));
      }
      if (event.key === "ArrowLeft") {
        setActive((index) =>
          index == null ? index : (index - 1 + images.length) % images.length,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  const current = active == null ? null : images[active];

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left"
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
            {current.placeholder ? (
              <p className="absolute bottom-6 left-1/2 max-w-md -translate-x-1/2 rounded-full bg-night/80 px-3 py-1 text-center text-xs text-sand">
                {labels.placeholder}
              </p>
            ) : null}
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
                  index == null ? index : (index - 1 + images.length) % images.length,
                )
              }
            >
              {labels.previous}
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-sand px-3 py-2 text-sm"
              onClick={() =>
                setActive((index) => (index == null ? index : (index + 1) % images.length))
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
