"use client";

import { useMemo, useState } from "react";
import { GalleryGrid } from "@/components/gallery";
import type { GalleryImage } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function PortfolioBrowser({
  images,
  locale,
  filters,
  empty,
  note,
  soon,
  labels,
}: {
  images: GalleryImage[];
  locale: Locale;
  filters: { id: string; label: string; soon?: boolean }[];
  empty: string;
  note: string;
  soon: string;
  labels: { open: string; close: string; previous: string; next: string; placeholder: string };
}) {
  const [filter, setFilter] = useState("all");
  const visible = useMemo(() => {
    if (filter === "all") return images.filter((image) => image.category !== "portraits" || image.id !== "cover-wide");
    if (filter === "places") {
      return images.filter((image) => image.provisional || image.categories.includes("places"));
    }
    return images.filter((image) => image.categories.includes(filter) || image.category === filter);
  }, [filter, images]);
  const current = filters.find((item) => item.id === filter);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4" role="tablist">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm",
              filter === item.id ? "border-terracotta bg-terracotta text-white" : "border-ink/15",
            )}
          >
            {item.label}
            {item.soon ? ` · ${soon}` : ""}
          </button>
        ))}
      </div>
      {current?.soon ? <p className="mb-4 text-sm text-ink/70">{note}</p> : null}
      {visible.length ? <GalleryGrid images={visible} locale={locale} labels={labels} /> : <p>{empty}</p>}
      <p className="mt-8 text-sm text-ink/60">{note}</p>
    </div>
  );
}
