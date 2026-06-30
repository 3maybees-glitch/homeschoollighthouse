import type { GroupByOption, ListingFormat, ListingType, SortOption } from "@/types/listing";
import { brand } from "@/lib/brand-vocabulary";

export const listingTypeOptions: { value: ListingType; label: string }[] = [
  { value: "curriculum", label: "Curriculum" },
  { value: "online_course", label: "Online Course" },
  { value: "coop", label: "Co-op" },
  { value: "tutor", label: "Tutor" },
  { value: "support_group", label: "Support Group" },
  { value: "field_trip", label: "Field Trip" },
  { value: "conference", label: "Conference" },
  { value: "scholarship", label: "College Scholarship" },
  { value: "standardized_test", label: "Standardized Test" },
  { value: "supplement", label: "Supplement" },
  { value: "other", label: "Other" },
];

export const formatOptions: { value: ListingFormat; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "in_person", label: "In Person" },
  { value: "hybrid", label: "Hybrid" },
];

export const philosophyOptions = [
  "classical",
  "charlotte_mason",
  "unschooling",
  "eclectic",
  "montessori",
  "waldorf",
  "unit_studies",
  "project_based",
  "secular",
  "religious",
].map((value) => ({
  value,
  label: value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
}));

export const valuesOptions = [
  { value: "screen_free", label: "Screen-Free" },
  { value: "tech_friendly", label: "Tech-Friendly" },
  { value: "parent_led", label: "Parent-Led" },
  { value: "self_paced", label: "Self-Paced" },
  { value: "neurodivergent_friendly", label: "Neurodivergent-Friendly" },
  { value: "special_needs", label: "Special Needs" },
  { value: "gifted", label: "Gifted" },
];

export const religionOptions = [
  { value: "secular", label: "Secular" },
  { value: "christian", label: "Christian" },
  { value: "catholic", label: "Catholic" },
  { value: "jewish", label: "Jewish" },
  { value: "muslim", label: "Muslim" },
];

export const subjectOptions = [
  "math",
  "science",
  "history",
  "language_arts",
  "reading",
  "writing",
  "art",
  "music",
  "foreign_language",
  "electives",
  "college_prep",
  "standardized_testing",
  "clt",
  "sat",
  "act",
  "psat",
  "ap_exams",
].map((value) => ({
  value,
  label: formatSubjectLabel(value),
}));

export const collegePrepTypeOptions = listingTypeOptions.filter((option) =>
  ["conference", "scholarship", "standardized_test"].includes(option.value),
);

export const testFilterOptions = [
  { value: "clt", label: "CLT" },
  { value: "sat", label: "SAT" },
  { value: "act", label: "ACT" },
  { value: "psat", label: "PSAT/NMSQT" },
  { value: "ap_exams", label: "AP Exams" },
  { value: "standardized_testing", label: "All Standardized Tests" },
];

function formatSubjectLabel(value: string) {
  const labels: Record<string, string> = {
    college_prep: "College Prep",
    standardized_testing: "Standardized Testing",
    clt: "CLT",
    sat: "SAT",
    act: "ACT",
    psat: "PSAT/NMSQT",
    ap_exams: "AP Exams",
  };

  if (labels[value]) return labels[value];

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: brand.sort.relevance },
  { value: "rating", label: brand.sort.rating },
  { value: "newest", label: brand.sort.newest },
  { value: "alpha", label: brand.sort.alpha },
  { value: "price_low", label: brand.sort.priceLow },
  { value: "price_high", label: brand.sort.priceHigh },
];

export const groupByOptions: { value: GroupByOption; label: string }[] = [
  { value: "none", label: brand.group.none },
  { value: "category", label: brand.group.category },
  { value: "philosophy", label: brand.group.philosophy },
  { value: "state", label: brand.group.state },
  { value: "format", label: brand.group.format },
  { value: "price", label: brand.group.price },
];

export const defaultFilterState = {
  sort: "relevance" as SortOption,
  groupBy: "none" as GroupByOption,
};
