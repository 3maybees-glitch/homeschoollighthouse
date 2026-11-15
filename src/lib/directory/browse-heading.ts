import type { FilterState } from "@/types/listing";
import { isSpecialNeedsValuesFilter } from "@/lib/directory/special-needs-match";

export function getBrowseHeading(filters: FilterState, total: number) {
  if (isSpecialNeedsValuesFilter(filters.values)) {
    const countLabel = total.toLocaleString();
    return {
      eyebrow: "Special Needs Navigation",
      title: `${countLabel} special-needs & neurodivergent-friendly resources`,
      description:
        "Curricula, supports, and adaptive tools for dyslexia, autism, ADHD, learning differences, and related needs—drawn from titles, descriptions, and publisher focus.",
    };
  }

  if (filters.q?.trim()) {
    return {
      title: `Search: “${filters.q.trim().slice(0, 80)}”`,
      description: `${total.toLocaleString()} matching resources in the Homeschool Lighthouse directory.`,
    };
  }

  if (filters.featuredOnly) {
    return {
      title: "Bright Beacons",
      description: `${total.toLocaleString()} hand-picked featured resources for values-minded homeschool families.`,
    };
  }

  return {
    title: "Sweep the horizon across 17,800+ homeschool resources",
    description:
      "Filter by philosophy, age, format, and location. Set your bearing, order your route, and find the beacons your family needs.",
  };
}