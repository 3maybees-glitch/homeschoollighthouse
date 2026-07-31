import type { NavigatorGradeLevel, NavigatorProfileAnswers } from "@/types/navigator";

export type NavigatorGradeBand = "elementary" | "middle" | "high" | "flexible";

export const GRADE_ORDER: NavigatorGradeLevel[] = [
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

export function gradeDisplayLabel(grade: NavigatorGradeLevel): string {
  if (grade === "ungraded") return "Ungraded / flexible year";
  if (grade === "9th") return "9th — Freshman";
  if (grade === "10th") return "10th — Sophomore";
  if (grade === "11th") return "11th — Junior";
  if (grade === "12th") return "12th — Senior";
  return `${grade} grade`;
}

/**
 * Parse free-text horizon like "8 years", "4 semesters", "6", "10 school years".
 * Returns whole school years to chart (minimum 1).
 */
export function parseRemainingYears(horizon: string): number | null {
  const text = horizon.trim().toLowerCase();
  if (!text) return null;

  const semesterMatch = text.match(/(\d+(?:\.\d+)?)\s*(semesters?|terms?)/);
  if (semesterMatch) {
    const semesters = Number(semesterMatch[1]);
    if (Number.isFinite(semesters) && semesters > 0) {
      return Math.max(1, Math.ceil(semesters / 2));
    }
  }

  const yearMatch = text.match(/(\d+(?:\.\d+)?)\s*(years?|yrs?|grades?|school\s*years?)?/);
  if (yearMatch) {
    const years = Number(yearMatch[1]);
    if (Number.isFinite(years) && years > 0) {
      return Math.max(1, Math.ceil(years));
    }
  }

  return null;
}

/**
 * Grades to chart from current grade through graduation, limited by the horizon field.
 * Includes the current grade as Year 1.
 */
export function resolveVoyageGrades(answers: NavigatorProfileAnswers): NavigatorGradeLevel[] {
  const parsedYears = parseRemainingYears(answers.semestersUntilGraduation);
  const current = answers.gradeLevel;

  if (!current || current === "ungraded") {
    const count = Math.min(parsedYears ?? 1, 12);
    return Array.from({ length: count }, () => "ungraded" as NavigatorGradeLevel);
  }

  const startIndex = GRADE_ORDER.indexOf(current);
  if (startIndex === -1) return [current];

  const gradesToGraduation = GRADE_ORDER.slice(startIndex);
  const yearCount = Math.min(parsedYears ?? gradesToGraduation.length, gradesToGraduation.length);
  return gradesToGraduation.slice(0, Math.max(1, yearCount));
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

export function companyFromListing(websiteUrl: string, title: string): string {
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./i, "");
    const brand = host.split(".")[0] ?? host;
    const pretty = brand
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    const known: Record<string, string> = {
      abeka: "Abeka",
      bjupress: "BJU Press",
      sonlight: "Sonlight",
      time4learning: "Time4Learning",
      mathusee: "Math-U-See",
      apologia: "Apologia",
      masterbooks: "Master Books",
      iew: "Institute for Excellence in Writing",
      cltexam: "CLT Exam",
      rainbowresource: "Rainbow Resource",
      goodandbeautiful: "The Good and the Beautiful",
      tied2teaching: "Tied 2 Teaching",
      classicalconversations: "Classical Conversations",
      allinonehomeschool: "All-in-One Homeschool",
      khanacademy: "Khan Academy",
    };

    const key = brand.toLowerCase();
    if (known[key]) return known[key];
    if (pretty) return pretty;
  } catch {
    // fall through
  }

  return title.split(/[:\-–|]/)[0]?.trim() || title;
}
