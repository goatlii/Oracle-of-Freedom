"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Disclosure for extra items that stay in the caller's own layout.
 * `mobile` hides them only below md. `any` hides them at every width when
 * the list is longer than `visible`. The button is omitted when there is
 * nothing further to show.
 */
export function MobileMore({
  enabled,
  total,
  visible,
  more,
  less,
  tone = "light",
  scope = "mobile",
  children,
}: {
  enabled: boolean;
  total: number;
  visible: number;
  more: string;
  less: string;
  tone?: "light" | "night";
  /** mobile: phones only. any: every viewport, once the list passes `visible`. */
  scope?: "mobile" | "any";
  children: (api: {
    hide: (index: number) => boolean;
    hiddenClass: string;
    itemId: (index: number) => string | undefined;
  }) => ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const prefix = useId().replace(/:/g, "");
  const folding = enabled && total > visible;
  const hiddenClass = scope === "mobile" ? "max-md:hidden" : "hidden";
  const hide = (index: number) => folding && !expanded && index >= visible;
  const itemId = (index: number) => (folding && index >= visible ? `${prefix}-more-${index}` : undefined);
  const controls = folding
    ? Array.from({ length: total - visible }, (_, offset) => `${prefix}-more-${visible + offset}`).join(" ")
    : undefined;

  return (
    <>
      {children({ hide, hiddenClass, itemId })}
      {folding ? (
        <Button
          type="button"
          variant={tone === "night" ? "ghost" : "outline"}
          className={cn("mt-6 w-full", scope === "mobile" && "md:hidden")}
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
