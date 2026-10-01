import { settings } from "@/lib/content";
import { isPlaceholder } from "@/lib/utils";

const TOKENS: Record<string, string> = {
  "{baseArea}": settings.baseArea,
  "{deposit}": settings.depositPercent,
  "{weeks}": settings.elopementGalleryWeeks,
  "{artistWeeks}": settings.artistGalleryWeeks,
  "{languages}": settings.languagesSpoken,
};

export function TokenText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\{(?:baseArea|deposit|weeks|artistWeeks|languages)\})/g);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const value = TOKENS[part];
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
