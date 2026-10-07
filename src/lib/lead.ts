export const SERVICE_IDS = [
  "portraits",
  "couple",
  "proposal",
  "soul-brand",
  "elopement",
  "wedding",
  "retreat",
  "artist",
  "music-video",
  "festival",
  "place",
  "other",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];
export type LeadGrade = "A" | "B" | "C";

export function budgetGroup(service: string) {
  if (service === "portraits" || service === "couple" || service === "proposal" || service === "soul-brand") {
    return "portraits";
  }
  if (service === "elopement" || service === "wedding") return "weddings";
  if (service === "retreat" || service === "festival") return "retreats";
  if (service === "artist" || service === "music-video") return "artists";
  if (service === "place") return "places";
  return "other";
}

const BELOW_MIN: Record<string, Set<string>> = {
  portraits: new Set(["lt-175"]),
  weddings: new Set(["lt-650"]),
  retreats: new Set(["lt-400"]),
  artists: new Set(["lt-110"]),
  places: new Set(["lt-475"]),
  other: new Set(),
};

const LOWEST: Record<string, string> = {
  portraits: "175-300",
  weddings: "650-1100",
  retreats: "400-1000",
  artists: "110-300",
  places: "475-900",
  other: "lt-175",
};

/** Budget value for people who are unsure or prefer not to share a figure. */
export const BUDGET_UNSURE = "unsure";

const COVERAGE_DAY_SERVICES = new Set(["retreat", "festival"]);

export function asksCoverageDays(service: string) {
  return COVERAGE_DAY_SERVICES.has(service);
}

/** Retreat and festival coverage longer than a single day needs a from–to span. */
export function multiDayCoverage(service: string, days?: string) {
  return asksCoverageDays(service) && Boolean(days) && days !== "1";
}

export function peopleMode(service: string): "people" | "event" | "none" {
  if (service === "proposal" || service === "festival") return "none";
  if (
    service === "portraits" ||
    service === "couple" ||
    service === "soul-brand" ||
    service === "elopement" ||
    service === "wedding" ||
    service === "other"
  ) {
    return "people";
  }
  if (service === "retreat") return "event";
  return "none";
}

export function gradeInquiry(input: {
  service: string;
  budget: string;
  date?: string;
  flexible: boolean;
  phone?: string;
  people?: string;
}): LeadGrade {
  const group = budgetGroup(input.service);
  if (input.service === "wedding" && input.people === "30+") return "C";
  if (BELOW_MIN[group]?.has(input.budget)) return "C";
  if (input.budget === BUDGET_UNSURE) return "B";

  const phone = Boolean(input.phone?.trim());
  const lowest = input.budget === LOWEST[group];
  let withinYear = false;
  if (input.date && !input.flexible) {
    const when = new Date(`${input.date}T12:00:00`);
    const now = new Date();
    const ahead = new Date(now);
    ahead.setFullYear(ahead.getFullYear() + 1);
    withinYear = when >= now && when <= ahead;
  }

  if (!lowest && withinYear && phone) return "A";
  return "B";
}
