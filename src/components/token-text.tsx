import { settings } from "@/lib/content";
import { isPlaceholder } from "@/lib/utils";

const TOKEN_KEYS =
  "baseArea|deposit|weeks|artistWeeks|filmWeeks|artistFilmWeeks|expressPhoto|expressFilm|languages";

function tokenRegex() {
  return new RegExp(`(\\{(?:${TOKEN_KEYS})\\})`, "g");
}

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

export function replaceTokens(text: string) {
  return text.replace(tokenRegex(), (token) => TOKENS[token] ?? token);
}

export function TokenText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(tokenRegex());
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
