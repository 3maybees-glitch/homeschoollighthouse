import type { NavigatorGradeLevel, NavigatorProfileAnswers } from "@/types/navigator";

export type NavigatorGradeBand = "elementary" | "middle" | "high" | "flexible";

const GRADE_ORDER: NavigatorGradeLevel[] = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "ungraded",
];

/** Typical age ranges used to match directory listings. */
export const gradeAgeRanges: Record<NavigatorGradeLevel, [number, number]> = {
  "1st": [6, 8],
  "2nd": [7, 9],
  "3rd": [8, 10],
  "4th": [9, 11],
  "5th": [10, 12],
  "6th": [11, 13],
  "7th": [12, 14],
  "8th": [13, 15],
  "9th": [14, 16],
  "10th": [15, 17],
  "11th": [16, 18],
  "12th": [17, 19],
  ungraded: [5, 18],
};

export function getGradeBand(grade: NavigatorGradeLevel | ""): NavigatorGradeBand {
  if (!grade || grade === "ungraded") return "flexible";
  const index = GRADE_ORDER.indexOf(grade);
  if (index >= 0 && index <= 4) return "elementary";
  if (index >= 5 && index <= 7) return "middle";
  if (index >= 8 && index <= 11) return "high";
  return "flexible";
}

export function isHighSchoolBand(grade: NavigatorGradeLevel | ""): boolean {
  return getGradeBand(grade) === "high";
}

export function resolveLearnerAge(answers: NavigatorProfileAnswers): number | null {
  const parsed = Number.parseInt(answers.age, 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  if (!answers.gradeLevel) return null;
  const [min, max] = gradeAgeRanges[answers.gradeLevel];
  return Math.round((min + max) / 2);
}

export function agesOverlap(
  learnerAge: number | null,
  grade: NavigatorGradeLevel | "",
  listingMin: number | null,
  listingMax: number | null,
): number {
  const min = listingMin ?? 0;
  const max = listingMax ?? 99;
  if (learnerAge != null) {
    if (learnerAge >= min && learnerAge <= max) return 14;
    if (learnerAge >= min - 1 && learnerAge <= max + 1) return 6;
    return -8;
  }
  if (!grade) return 0;
  const [gMin, gMax] = gradeAgeRanges[grade];
  const overlaps = gMin <= max && gMax >= min;
  if (!overlaps) return -10;
  return 10;
}
