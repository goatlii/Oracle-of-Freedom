import { settings } from "@/lib/content";
import { isPlaceholder } from "@/lib/utils";

const TOKENS: Record<string, string> = {
  "{baseArea}": settings.baseArea,
  "{deposit}": settings.depositPercent,
  "{weeks}": settings.elopementGalleryWeeks,
  "{artistWeeks}": settings.artistGalleryWeeks,
  "{filmWeeks}": settings.elopementFilmWeeks,
  "{artistFilmWeeks}": settings.artistFilmWeeks,
  "{expressPhoto}": settings.expressPhotoDays,
  "{expressFilm}": settings.expressFilmDays,
  "{languages}": settings.languagesSpoken,
};

const TOKEN_SPLIT =
  /(\{(?:baseArea|deposit|artistFilmWeeks|artistWeeks|filmWeeks|weeks|expressPhoto|expressFilm|languages)\})/g;

export function replaceTokens(text: string) {
  return text.replace(TOKEN_SPLIT, (match) => TOKENS[match] ?? match);
}

export function TokenText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(TOKEN_SPLIT);
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
