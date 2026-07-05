export type SubjectCategory =
  | "math"
  | "science"
  | "english"
  | "social_studies"
  | "foreign_language"
  | "elective";

export type SubjectOption = {
  id: string;
  label: string;
  category: SubjectCategory;
  defaultCredits: number;
};

export type GradeOption = {
  value: string;
  label: string;
  gpaPoints: number | null;
  earnsCredit: boolean;
};

export type CourseEntry = {
  id: string;
  subjectId: string;
  grade: string;
};

export type YearKey = "freshman" | "sophomore" | "junior" | "senior";

export type YearDefinition = {
  key: YearKey;
  label: string;
  gradeLabel: string;
};

export const highSchoolYears: YearDefinition[] = [
  { key: "freshman", label: "Freshman Year", gradeLabel: "Grade 9" },
  { key: "sophomore", label: "Sophomore Year", gradeLabel: "Grade 10" },
  { key: "junior", label: "Junior Year", gradeLabel: "Grade 11" },
  { key: "senior", label: "Senior Year", gradeLabel: "Grade 12" },
];

export const subjectCategories: Record<SubjectCategory, string> = {
  math: "Mathematics",
  science: "Science",
  english: "English & Literature",
  social_studies: "Social Studies",
  foreign_language: "Foreign Language",
  elective: "Electives & Other",
};

export const subjectCatalog: SubjectOption[] = [
  { id: "pre-algebra", label: "Pre-Algebra", category: "math", defaultCredits: 1 },
  { id: "algebra-i", label: "Algebra I", category: "math", defaultCredits: 1 },
  { id: "geometry", label: "Geometry", category: "math", defaultCredits: 1 },
  { id: "algebra-ii", label: "Algebra II", category: "math", defaultCredits: 1 },
  { id: "pre-calculus", label: "Pre-Calculus", category: "math", defaultCredits: 1 },
  { id: "calculus", label: "Calculus", category: "math", defaultCredits: 1 },
  { id: "statistics", label: "Statistics", category: "math", defaultCredits: 0.5 },
  { id: "consumer-math", label: "Consumer Math", category: "math", defaultCredits: 1 },

  { id: "biology", label: "Biology", category: "science", defaultCredits: 1 },
  { id: "chemistry", label: "Chemistry", category: "science", defaultCredits: 1 },
  { id: "physics", label: "Physics", category: "science", defaultCredits: 1 },
  { id: "earth-science", label: "Earth Science", category: "science", defaultCredits: 1 },
  { id: "anatomy", label: "Anatomy & Physiology", category: "science", defaultCredits: 1 },
  { id: "environmental-science", label: "Environmental Science", category: "science", defaultCredits: 1 },

  { id: "literature", label: "Literature", category: "english", defaultCredits: 1 },
  { id: "american-literature", label: "American Literature", category: "english", defaultCredits: 1 },
  { id: "british-literature", label: "British Literature", category: "english", defaultCredits: 1 },
  { id: "world-literature", label: "World Literature", category: "english", defaultCredits: 1 },
  { id: "composition", label: "Composition / Writing", category: "english", defaultCredits: 1 },
  { id: "grammar", label: "Grammar & Language Arts", category: "english", defaultCredits: 0.5 },

  { id: "world-history", label: "World History", category: "social_studies", defaultCredits: 1 },
  { id: "us-history", label: "U.S. History", category: "social_studies", defaultCredits: 1 },
  { id: "government", label: "Government / Civics", category: "social_studies", defaultCredits: 0.5 },
  { id: "economics", label: "Economics", category: "social_studies", defaultCredits: 0.5 },
  { id: "geography", label: "Geography", category: "social_studies", defaultCredits: 0.5 },

  { id: "spanish-i", label: "Spanish I", category: "foreign_language", defaultCredits: 1 },
  { id: "spanish-ii", label: "Spanish II", category: "foreign_language", defaultCredits: 1 },
  { id: "french-i", label: "French I", category: "foreign_language", defaultCredits: 1 },
  { id: "french-ii", label: "French II", category: "foreign_language", defaultCredits: 1 },
  { id: "latin-i", label: "Latin I", category: "foreign_language", defaultCredits: 1 },
  { id: "latin-ii", label: "Latin II", category: "foreign_language", defaultCredits: 1 },

  { id: "art", label: "Art", category: "elective", defaultCredits: 0.5 },
  { id: "music", label: "Music", category: "elective", defaultCredits: 0.5 },
  { id: "physical-education", label: "Physical Education", category: "elective", defaultCredits: 0.5 },
  { id: "health", label: "Health", category: "elective", defaultCredits: 0.5 },
  { id: "computer-science", label: "Computer Science", category: "elective", defaultCredits: 1 },
  { id: "speech", label: "Speech / Communication", category: "elective", defaultCredits: 0.5 },
  { id: "logic", label: "Logic / Critical Thinking", category: "elective", defaultCredits: 0.5 },
  { id: "bible", label: "Bible / Religion", category: "elective", defaultCredits: 0.5 },
  { id: "career-elective", label: "Career / Vocational Elective", category: "elective", defaultCredits: 1 },
];

export const gradeOptions: GradeOption[] = [
  { value: "A", label: "A (Excellent)", gpaPoints: 4.0, earnsCredit: true },
  { value: "A-", label: "A- (Excellent)", gpaPoints: 3.7, earnsCredit: true },
  { value: "B+", label: "B+ (Good)", gpaPoints: 3.3, earnsCredit: true },
  { value: "B", label: "B (Good)", gpaPoints: 3.0, earnsCredit: true },
  { value: "B-", label: "B- (Good)", gpaPoints: 2.7, earnsCredit: true },
  { value: "C+", label: "C+ (Satisfactory)", gpaPoints: 2.3, earnsCredit: true },
  { value: "C", label: "C (Satisfactory)", gpaPoints: 2.0, earnsCredit: true },
  { value: "C-", label: "C- (Satisfactory)", gpaPoints: 1.7, earnsCredit: true },
  { value: "D+", label: "D+ (Passing)", gpaPoints: 1.3, earnsCredit: true },
  { value: "D", label: "D (Passing)", gpaPoints: 1.0, earnsCredit: true },
  { value: "F", label: "F (No Credit)", gpaPoints: 0.0, earnsCredit: false },
  { value: "P", label: "Pass (Credit, no GPA)", gpaPoints: null, earnsCredit: true },
  { value: "IP", label: "In Progress", gpaPoints: null, earnsCredit: false },
];

export const defaultYearCourses: Record<YearKey, CourseEntry[]> = {
  freshman: [
    { id: "fr-1", subjectId: "algebra-i", grade: "B" },
    { id: "fr-2", subjectId: "biology", grade: "A-" },
    { id: "fr-3", subjectId: "literature", grade: "A" },
    { id: "fr-4", subjectId: "world-history", grade: "B+" },
    { id: "fr-5", subjectId: "spanish-i", grade: "B" },
    { id: "fr-6", subjectId: "physical-education", grade: "A" },
  ],
  sophomore: [
    { id: "so-1", subjectId: "geometry", grade: "B" },
    { id: "so-2", subjectId: "chemistry", grade: "B+" },
    { id: "so-3", subjectId: "american-literature", grade: "A-" },
    { id: "so-4", subjectId: "us-history", grade: "A" },
    { id: "so-5", subjectId: "spanish-ii", grade: "B-" },
    { id: "so-6", subjectId: "health", grade: "A" },
  ],
  junior: [
    { id: "ju-1", subjectId: "algebra-ii", grade: "B+" },
    { id: "ju-2", subjectId: "physics", grade: "B" },
    { id: "ju-3", subjectId: "british-literature", grade: "A" },
    { id: "ju-4", subjectId: "government", grade: "A-" },
    { id: "ju-5", subjectId: "economics", grade: "B" },
    { id: "ju-6", subjectId: "computer-science", grade: "A" },
  ],
  senior: [
    { id: "se-1", subjectId: "pre-calculus", grade: "B" },
    { id: "se-2", subjectId: "anatomy", grade: "A-" },
    { id: "se-3", subjectId: "world-literature", grade: "A" },
    { id: "se-4", subjectId: "speech", grade: "A" },
    { id: "se-5", subjectId: "art", grade: "A" },
    { id: "se-6", subjectId: "logic", grade: "B+" },
  ],
};

export function getSubjectById(subjectId: string): SubjectOption | undefined {
  return subjectCatalog.find((subject) => subject.id === subjectId);
}

export function getGradeByValue(grade: string): GradeOption | undefined {
  return gradeOptions.find((option) => option.value === grade);
}

export function getCourseCredits(subjectId: string): number {
  return getSubjectById(subjectId)?.defaultCredits ?? 1;
}

export function getEarnedCredits(subjectId: string, grade: string): number {
  const courseCredits = getCourseCredits(subjectId);
  const gradeOption = getGradeByValue(grade);
  if (!gradeOption?.earnsCredit) return 0;
  return courseCredits;
}

export type CourseSummary = {
  subjectLabel: string;
  category: SubjectCategory;
  grade: string;
  courseCredits: number;
  earnedCredits: number;
  gpaPoints: number | null;
  countsTowardGpa: boolean;
};

export type YearSummary = {
  year: YearDefinition;
  courses: CourseSummary[];
  attemptedCredits: number;
  earnedCredits: number;
  yearGpa: number | null;
};

export type TranscriptSummary = {
  years: YearSummary[];
  totalAttemptedCredits: number;
  totalEarnedCredits: number;
  cumulativeGpa: number | null;
  creditsByCategory: Record<SubjectCategory, number>;
};

export function summarizeCourse(entry: CourseEntry): CourseSummary {
  const subject = getSubjectById(entry.subjectId);
  const gradeOption = getGradeByValue(entry.grade);
  const courseCredits = getCourseCredits(entry.subjectId);
  const earnedCredits = getEarnedCredits(entry.subjectId, entry.grade);

  return {
    subjectLabel: subject?.label ?? "Unknown Course",
    category: subject?.category ?? "elective",
    grade: entry.grade,
    courseCredits,
    earnedCredits,
    gpaPoints: gradeOption?.gpaPoints ?? null,
    countsTowardGpa: gradeOption?.gpaPoints != null,
  };
}

export function summarizeYear(
  year: YearDefinition,
  courses: CourseEntry[],
): YearSummary {
  const summaries = courses
    .filter((course) => course.subjectId)
    .map((course) => summarizeCourse(course));

  const attemptedCredits = summaries.reduce((sum, course) => sum + course.courseCredits, 0);
  const earnedCredits = summaries.reduce((sum, course) => sum + course.earnedCredits, 0);

  const gpaCourses = summaries.filter((course) => course.countsTowardGpa);
  const gpaCredits = gpaCourses.reduce((sum, course) => sum + course.courseCredits, 0);
  const gpaPoints = gpaCourses.reduce(
    (sum, course) => sum + (course.gpaPoints ?? 0) * course.courseCredits,
    0,
  );

  return {
    year,
    courses: summaries,
    attemptedCredits,
    earnedCredits,
    yearGpa: gpaCredits > 0 ? gpaPoints / gpaCredits : null,
  };
}

export function summarizeTranscript(
  yearCourses: Record<YearKey, CourseEntry[]>,
): TranscriptSummary {
  const years = highSchoolYears.map((year) =>
    summarizeYear(year, yearCourses[year.key] ?? []),
  );

  const totalAttemptedCredits = years.reduce((sum, year) => sum + year.attemptedCredits, 0);
  const totalEarnedCredits = years.reduce((sum, year) => sum + year.earnedCredits, 0);

  const creditsByCategory: Record<SubjectCategory, number> = {
    math: 0,
    science: 0,
    english: 0,
    social_studies: 0,
    foreign_language: 0,
    elective: 0,
  };

  for (const year of years) {
    for (const course of year.courses) {
      creditsByCategory[course.category] += course.earnedCredits;
    }
  }

  const gpaCourses = years.flatMap((year) =>
    year.courses.filter((course) => course.countsTowardGpa),
  );
  const gpaCredits = gpaCourses.reduce((sum, course) => sum + course.courseCredits, 0);
  const gpaPoints = gpaCourses.reduce(
    (sum, course) => sum + (course.gpaPoints ?? 0) * course.courseCredits,
    0,
  );

  return {
    years,
    totalAttemptedCredits,
    totalEarnedCredits,
    cumulativeGpa: gpaCredits > 0 ? gpaPoints / gpaCredits : null,
    creditsByCategory,
  };
}

export function formatGpa(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(2);
}

export function formatCredits(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function createCourseId(yearKey: YearKey): string {
  return `${yearKey}-${crypto.randomUUID().slice(0, 8)}`;
}

export function buildTranscriptCsv(
  studentName: string,
  schoolName: string,
  yearCourses: Record<YearKey, CourseEntry[]>,
): string {
  const summary = summarizeTranscript(yearCourses);
  const lines: string[] = [
    "Homeschool Lighthouse — The Credit Logbook",
    `Student,${escapeCsv(studentName || "Student")}`,
    `School,${escapeCsv(schoolName || "Homeschool")}`,
    "",
    "Year,Grade Level,Subject,Category,Letter Grade,Course Credits,Earned Credits",
  ];

  for (const year of summary.years) {
    const entries = yearCourses[year.year.key] ?? [];
    for (const entry of entries) {
      const course = summarizeCourse(entry);
      lines.push(
        [
          year.year.label,
          year.year.gradeLabel,
          course.subjectLabel,
          subjectCategories[course.category],
          course.grade,
          formatCredits(course.courseCredits),
          formatCredits(course.earnedCredits),
        ]
          .map(escapeCsv)
          .join(","),
      );
    }
    lines.push(
      [
        year.year.label,
        "Year Totals",
        "",
        "",
        "",
        formatCredits(year.attemptedCredits),
        formatCredits(year.earnedCredits),
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  lines.push("");
  lines.push(`Cumulative GPA,${formatGpa(summary.cumulativeGpa)}`);
  lines.push(`Total Earned Credits,${formatCredits(summary.totalEarnedCredits)}`);
  lines.push("");
  lines.push("Credits by Subject Area");
  for (const [category, label] of Object.entries(subjectCategories) as [SubjectCategory, string][]) {
    lines.push(`${label},${formatCredits(summary.creditsByCategory[category])}`);
  }

  return lines.join("\n");
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
