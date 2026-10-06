"use client";

import { useMemo, useState } from "react";
import { GalleryGrid } from "@/components/gallery";
import type { GalleryImage } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function matchesPortfolioFilter(image: GalleryImage, filter: string) {
  if (image.portfolioTabs !== undefined) return image.portfolioTabs.includes(filter);
  if (filter === "all") return image.category !== "portraits" || image.id !== "cover-wide";
  return image.categories.includes(filter) || image.category === filter;
}

export function PortfolioBrowser({
  images,
  locale,
  filters,
  empty,
  soon,
  labels,
}: {
  images: GalleryImage[];
  locale: Locale;
  filters: { id: string; label: string; soon?: boolean }[];
  empty: string;
  soon: string;
  labels: { open: string; close: string; previous: string; next: string; placeholder: string };
}) {
  const [filter, setFilter] = useState("all");
  const visible = useMemo(() => {
    const published = images.filter((image) => !image.placeholder);
    return published.filter((image) => matchesPortfolioFilter(image, filter));
  }, [filter, images]);

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
      {visible.length ? <GalleryGrid images={visible} locale={locale} labels={labels} /> : <p>{empty}</p>}
    </div>
  );
}
