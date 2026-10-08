import { cache } from "react";
import { applyTokens, buildTokenMap, splitTokenText } from "@/lib/delivery";
import { getSettings } from "@/lib/offers";
import { isPlaceholder } from "@/lib/utils";

export const liveTokenMap = cache(async () => buildTokenMap((await getSettings()).timings));

export async function replaceTokens(text: string) {
  return applyTokens(text, await liveTokenMap());
}

export async function TokenText({ text, className }: { text: string; className?: string }) {
  const tokens = await liveTokenMap();
  const parts = splitTokenText(text);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const value = tokens[part];
        if (!value) return <span key={index}>{part}</span>;
        if (isPlaceholder(value)) {
          return (
            <span key={index} className="placeholder-chip">
              {value}
            </span>
          );
        }
        return <span key={index}>{value}</span>;
      })}
    </span>
  );
}
