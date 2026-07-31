import type {
  NavigatorChart,
  NavigatorGradeLevel,
  NavigatorProfileAnswers,
  NavigatorSubjectPlan,
  NavigatorYearPlan,
} from "@/types/navigator";
import { gradeDisplayLabel } from "@/lib/navigator/grades";

type StoredPlans =
  | NavigatorSubjectPlan[]
  | NavigatorYearPlan[]
  | {
      version?: number;
      subjectPlans?: NavigatorSubjectPlan[];
      yearPlans?: NavigatorYearPlan[];
    };

export function normalizeChartPlans(
  raw: unknown,
  answers?: NavigatorProfileAnswers,
): { subjectPlans: NavigatorSubjectPlan[]; yearPlans: NavigatorYearPlan[] } {
  if (!raw) {
    return { subjectPlans: [], yearPlans: [] };
  }

  if (!Array.isArray(raw) && typeof raw === "object") {
    const wrapped = raw as {
      subjectPlans?: NavigatorSubjectPlan[];
      yearPlans?: NavigatorYearPlan[];
    };
    const yearPlans = wrapped.yearPlans ?? [];
    const subjectPlans = wrapped.subjectPlans ?? yearPlans[0]?.subjectPlans ?? [];
    return { subjectPlans, yearPlans };
  }

  if (!Array.isArray(raw) || raw.length === 0) {
    return { subjectPlans: [], yearPlans: [] };
  }

  const first = raw[0] as Record<string, unknown>;
  if (typeof first.yearIndex === "number" && Array.isArray(first.subjectPlans)) {
    const yearPlans = raw as NavigatorYearPlan[];
    return {
      yearPlans,
      subjectPlans: yearPlans[0]?.subjectPlans ?? [],
    };
  }

  const subjectPlans = raw as NavigatorSubjectPlan[];
  const grade = (answers?.gradeLevel || "ungraded") as NavigatorGradeLevel;
  const yearPlans: NavigatorYearPlan[] = [
    {
      yearIndex: 1,
      gradeLevel: grade,
      gradeLabel: grade === "ungraded" ? "Voyage year 1" : gradeDisplayLabel(grade),
      ageHint: answers?.age ? `About age ${answers.age}` : "Age flexible",
      subjectPlans,
    },
  ];
  return { subjectPlans, yearPlans };
}

export function serializeChartPlans(chart: Pick<NavigatorChart, "subjectPlans" | "yearPlans">): StoredPlans {
  return {
    version: 2,
    subjectPlans: chart.subjectPlans,
    yearPlans: chart.yearPlans,
  };
}

export function hydrateNavigatorChart(input: {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  answers: NavigatorProfileAnswers;
  completionPercent: number;
  subjectPlansRaw: unknown;
  encouragement: string;
  yearPlans?: NavigatorYearPlan[];
}): NavigatorChart {
  const fromField = input.yearPlans?.length
    ? {
        yearPlans: input.yearPlans,
        subjectPlans: input.yearPlans[0]?.subjectPlans ?? [],
      }
    : normalizeChartPlans(input.subjectPlansRaw, input.answers);

  return {
    id: input.id,
    userId: input.userId,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    answers: input.answers,
    completionPercent: input.completionPercent,
    subjectPlans: fromField.subjectPlans,
    yearPlans: fromField.yearPlans,
    encouragement: input.encouragement,
  };
}
