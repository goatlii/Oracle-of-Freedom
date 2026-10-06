import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPlaceholder(value: string) {
  return /placeholder/i.test(value);
}

/** Solid-colour stand-ins and low-resolution extracts from the 2026 portfolio PDF. */
export function isPublishedPhoto(image: { placeholder?: boolean; source?: string }) {
  return image.placeholder !== true && !/2026 portfolio pdf/i.test(image.source ?? "");
}
