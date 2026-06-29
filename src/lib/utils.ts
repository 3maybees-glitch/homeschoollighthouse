import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(min?: number | null, max?: number | null, priceType?: string) {
  if (priceType === "free") return "Free";
  if (priceType === "donation") return "Donation";
  if (priceType === "contact") return "Contact for pricing";
  if (priceType === "subscription" && min != null) return `From $${min}/mo`;
  if (min != null && max != null && min !== max) return `$${min} – $${max}`;
  if (min != null) return `$${min}`;
  return "Varies";
}

export function formatAgeRange(ageMin?: number | null, ageMax?: number | null) {
  if (ageMin == null && ageMax == null) return "All ages";
  if (ageMin != null && ageMax != null) return `Ages ${ageMin}–${ageMax}`;
  if (ageMin != null) return `Ages ${ageMin}+`;
  return `Up to age ${ageMax}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
