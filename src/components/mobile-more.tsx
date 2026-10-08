"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * Mobile-only disclosure. Extra items stay in the caller's layout and are
 * hidden below the md breakpoint with `max-md:hidden`, so desktop columns and
 * grids are unchanged and the first paint matches the server.
 */
export function MobileMore({
  enabled,
  total,
  visible,
  more,
  less,
  tone = "light",
  children,
}: {
  enabled: boolean;
  total: number;
  visible: number;
  more: string;
  less: string;
  tone?: "light" | "night";
  children: (api: {
    hide: (index: number) => boolean;
    itemId: (index: number) => string | undefined;
  }) => ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const prefix = useId().replace(/:/g, "");
  const folding = enabled && total > visible;
  const hide = (index: number) => folding && !expanded && index >= visible;
  const itemId = (index: number) => (folding && index >= visible ? `${prefix}-more-${index}` : undefined);
  const controls = folding
    ? Array.from({ length: total - visible }, (_, offset) => `${prefix}-more-${visible + offset}`).join(" ")
    : undefined;

  return (
    <>
      {children({ hide, itemId })}
      {folding ? (
        <Button
          type="button"
          variant={tone === "night" ? "ghost" : "outline"}
          className="mt-6 w-full md:hidden"
          aria-expanded={expanded}
          aria-controls={controls}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? less : more}
        </Button>
      ) : null}
    </>
  );
}
