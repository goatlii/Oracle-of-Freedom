export const INQUIRY_STATUSES = ["new", "replied", "archived"] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export type Inquiry = {
  id: string;
  createdAt: string;
  status: InquiryStatus;
  name: string;
  email: string;
  phone: string;
  service: string;
  serviceLabel: string;
  when: string;
  place: string;
  story: string;
  language: string;
  languageLabel: string;
  budgetLabel: string;
  grade: string;
};

const languages: Record<string, string> = {
  en: "Inglés",
  es: "Español",
  lt: "Lituano",
  pt: "Portugués",
};

export function languageLabel(code: string) {
  return languages[code] || code;
}

export function isInquiry(value: unknown): value is Inquiry {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Inquiry>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    item.id.length <= 80 &&
    typeof item.createdAt === "string" &&
    (item.status === "new" || item.status === "replied" || item.status === "archived") &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    item.name.length <= 200 &&
    typeof item.email === "string" &&
    item.email.length > 0 &&
    item.email.length <= 200 &&
    typeof item.phone === "string" &&
    item.phone.length <= 40 &&
    typeof item.service === "string" &&
    typeof item.serviceLabel === "string" &&
    typeof item.when === "string" &&
    typeof item.place === "string" &&
    typeof item.story === "string" &&
    typeof item.language === "string" &&
    typeof item.languageLabel === "string" &&
    typeof item.budgetLabel === "string" &&
    typeof item.grade === "string"
  );
}

export function sortInquiries(inquiries: Inquiry[]) {
  return [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
