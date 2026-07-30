import type {
  NavigatorDelivery,
  NavigatorFaithPreference,
  NavigatorGradeLevel,
  NavigatorGradingStyle,
  NavigatorGroupStyle,
  NavigatorLearningStyle,
  NavigatorPriceRange,
  NavigatorProfileAnswers,
  NavigatorSubjectKey,
  NavigatorTechPreference,
  NavigatorWritingLevel,
} from "@/types/navigator";

export const NAVIGATOR_PRICE_LABEL = "$77";
export const NAVIGATOR_PRICE_CENTS = 7700;

export const emptyNavigatorAnswers = (): NavigatorProfileAnswers => ({
  firstName: "",
  age: "",
  gradeLevel: "",
  semestersUntilGraduation: "",
  coreSubjects: [],
  interestSubjects: [],
  learningStyles: [],
  deliveryModes: [],
  priceRange: "",
  subjectStrengths: [],
  subjectImprovements: [],
  careerTradePotentials: [],
  personalityTraits: [],
  gradingStyle: "",
  writingLevel: "",
  techPreference: "",
  faithPreference: "",
  groupStyle: "",
  collegeGoals: "",
  additionalNotes: "",
});

export const gradeLevelOptions: { value: NavigatorGradeLevel; label: string }[] = [
  { value: "8th", label: "8th (pre–high school)" },
  { value: "9th", label: "9th — Freshman" },
  { value: "10th", label: "10th — Sophomore" },
  { value: "11th", label: "11th — Junior" },
  { value: "12th", label: "12th — Senior" },
  { value: "ungraded", label: "Ungraded / flexible track" },
];

export const coreSubjectOptions: { value: NavigatorSubjectKey; label: string }[] = [
  { value: "english", label: "English / Language Arts" },
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science (lab preferred)" },
  { value: "history", label: "History / Social Studies" },
  { value: "foreign_language", label: "Foreign Language" },
];

export const interestSubjectOptions: { value: NavigatorSubjectKey; label: string }[] = [
  { value: "art", label: "Art & Design" },
  { value: "music", label: "Music" },
  { value: "electives", label: "General Electives" },
  { value: "college_prep", label: "College Prep / Testing" },
  { value: "career_trade", label: "Career & Trade Pathways" },
  { value: "physical_education", label: "Physical Education / Health" },
  { value: "bible_worldview", label: "Bible / Worldview" },
  { value: "computer_technology", label: "Computer & Technology" },
  { value: "life_skills", label: "Life Skills / Home Economics" },
];

export const learningStyleOptions: { value: NavigatorLearningStyle; label: string }[] = [
  { value: "visual", label: "Visual — charts, diagrams, video" },
  { value: "auditory", label: "Auditory — lectures, discussion, audio" },
  { value: "kinesthetic", label: "Kinesthetic — hands-on, labs, movement" },
  { value: "reading_writing", label: "Reading / Writing — books & notebooks" },
  { value: "mixed", label: "Mixed — a little of everything" },
];

export const deliveryOptions: { value: NavigatorDelivery; label: string }[] = [
  { value: "online", label: "Online / digital courses" },
  { value: "hybrid", label: "Hybrid — mix of online & home" },
  { value: "in_home", label: "In-home parent-led" },
  { value: "coop", label: "Co-op or group classes" },
];

export const priceRangeOptions: { value: NavigatorPriceRange; label: string }[] = [
  { value: "free_budget", label: "Free / very low budget" },
  { value: "under_50", label: "Under $50 per subject" },
  { value: "50_150", label: "$50–$150 per subject" },
  { value: "150_400", label: "$150–$400 per subject" },
  { value: "400_plus", label: "$400+ (premium / online academy)" },
  { value: "flexible", label: "Flexible — quality first" },
];

export const strengthImprovementOptions = [
  "English & writing",
  "Reading comprehension",
  "Algebra & math",
  "Geometry",
  "Biology / life science",
  "Chemistry / physical science",
  "History & civics",
  "Foreign language",
  "Fine arts",
  "Organization & study skills",
  "Public speaking",
  "Research & essays",
];

export const careerTradeOptions = [
  "College / university track",
  "Nursing / health sciences",
  "Engineering / STEM",
  "Education / teaching",
  "Business / entrepreneurship",
  "Trades (electrician, HVAC, welding)",
  "Computer science / IT",
  "Creative arts / media",
  "Ministry / missions",
  "Military / public service",
  "Undecided — exploring",
];

export const personalityTraitOptions = [
  "Curious & exploratory",
  "Structured & routine-loving",
  "Creative & imaginative",
  "Quiet & reflective",
  "Outgoing & social",
  "Competitive & goal-driven",
  "Gentle & sensitive",
  "Independent & self-starting",
  "Needs encouragement & pacing",
  "Thrives with deadlines",
];

export const gradingStyleOptions: { value: NavigatorGradingStyle; label: string }[] = [
  { value: "self_grading", label: "Parent / self-grading at home" },
  { value: "instructor_grading", label: "Instructor-graded (online teacher or co-op)" },
  { value: "mixed", label: "Mix of both" },
];

export const writingLevelOptions: { value: NavigatorWritingLevel; label: string }[] = [
  { value: "building", label: "Still building foundational writing" },
  { value: "solid", label: "Solid high-school writing" },
  { value: "advanced", label: "Advanced / honors-ready" },
  { value: "college_ready", label: "College-ready essays & research" },
];

export const techPreferenceOptions: { value: NavigatorTechPreference; label: string }[] = [
  { value: "computer_tech", label: "Computer & technology-forward" },
  { value: "paper_offline", label: "Paper / offline / screen-light" },
  { value: "balanced", label: "Balanced tech + paper" },
];

export const faithPreferenceOptions: { value: NavigatorFaithPreference; label: string }[] = [
  { value: "christian", label: "Christian / faith-based preferred" },
  { value: "catholic", label: "Catholic preferred" },
  { value: "jewish", label: "Jewish preferred" },
  { value: "muslim", label: "Muslim preferred" },
  { value: "secular", label: "Secular / neutral standards" },
  { value: "open", label: "Open — either is fine" },
];

export const groupStyleOptions: { value: NavigatorGroupStyle; label: string }[] = [
  { value: "one_on_one", label: "One-on-one with parent / tutor" },
  { value: "siblings_group", label: "Multiple children / shared subjects" },
  { value: "coop_group", label: "Co-op or class group setting" },
  { value: "flexible", label: "Flexible by subject" },
];

export type SurveyStepId =
  | "student"
  | "core"
  | "interests"
  | "learning"
  | "budget"
  | "strengths"
  | "path"
  | "style"
  | "faith"
  | "goals";

export interface SurveyStep {
  id: SurveyStepId;
  title: string;
  subtitle: string;
  fields: (keyof NavigatorProfileAnswers)[];
}

export const surveySteps: SurveyStep[] = [
  {
    id: "student",
    title: "Meet the sailor",
    subtitle: "Tell us who this academic chart is for — like a thoughtful profile for their voyage.",
    fields: ["firstName", "age", "gradeLevel", "semestersUntilGraduation"],
  },
  {
    id: "core",
    title: "Core courses to chart",
    subtitle:
      "Select the core subjects you want three matched choices for. College-bound charts often include English, math, lab science, history, and language.",
    fields: ["coreSubjects"],
  },
  {
    id: "interests",
    title: "Interests, electives & activities",
    subtitle: "Electives and pathways make the transcript shine — pick what lights them up.",
    fields: ["interestSubjects"],
  },
  {
    id: "learning",
    title: "How they learn best",
    subtitle: "Learning styles and delivery modes help us steer toward the right harbor.",
    fields: ["learningStyles", "deliveryModes"],
  },
  {
    id: "budget",
    title: "Budget for the voyage",
    subtitle: "A clear price range keeps recommendations realistic for your family.",
    fields: ["priceRange"],
  },
  {
    id: "strengths",
    title: "Strengths & fair winds needed",
    subtitle: "Where they soar — and where a gentler current or extra support helps.",
    fields: ["subjectStrengths", "subjectImprovements"],
  },
  {
    id: "path",
    title: "Career, trade & personality",
    subtitle: "Future harbors and personality traits shape electives and pacing.",
    fields: ["careerTradePotentials", "personalityTraits"],
  },
  {
    id: "style",
    title: "Grading, writing & tools",
    subtitle: "Self-grading vs instructor, writing level, and tech vs paper preferences.",
    fields: ["gradingStyle", "writingLevel", "techPreference", "groupStyle"],
  },
  {
    id: "faith",
    title: "Faith & standards",
    subtitle: "Religion-based options or secular standards — we keep this private and protected.",
    fields: ["faithPreference"],
  },
  {
    id: "goals",
    title: "Graduation horizon",
    subtitle:
      "College goals, dual enrollment dreams, or trade paths — including universities that welcome homeschool transcripts.",
    fields: ["collegeGoals", "additionalNotes"],
  },
];

/** Weighted completion: required profile depth vs optional notes. */
export function computeCompletionPercent(answers: NavigatorProfileAnswers): number {
  const checks: boolean[] = [
    Boolean(answers.firstName.trim()),
    Boolean(answers.age.trim()),
    Boolean(answers.gradeLevel),
    Boolean(answers.semestersUntilGraduation.trim()),
    answers.coreSubjects.length > 0,
    answers.interestSubjects.length > 0,
    answers.learningStyles.length > 0,
    answers.deliveryModes.length > 0,
    Boolean(answers.priceRange),
    answers.subjectStrengths.length > 0,
    answers.subjectImprovements.length > 0,
    answers.careerTradePotentials.length > 0,
    answers.personalityTraits.length > 0,
    Boolean(answers.gradingStyle),
    Boolean(answers.writingLevel),
    Boolean(answers.techPreference),
    Boolean(answers.faithPreference),
    Boolean(answers.groupStyle),
    Boolean(answers.collegeGoals.trim()),
  ];

  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export function isStepComplete(step: SurveyStep, answers: NavigatorProfileAnswers): boolean {
  return step.fields.every((field) => {
    const value = answers[field];
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(String(value ?? "").trim());
  });
}

export const libertyCreditGuidance = {
  english: "Often 4 units of English for competitive college admission (e.g. Liberty University).",
  math: "Often 3–4 units of mathematics through Algebra II or beyond.",
  science: "Often 3 lab science units (biology, chemistry, physics preferred).",
  history: "Often 3 social studies / history units, including U.S. history & government.",
  foreign_language: "Often 2 units of the same foreign language for college-bound tracks.",
  electives: "Electives fill remaining credits toward a strong graduation transcript (~22+ total).",
  sourceLabel: "Homeschool college-admission patterns (incl. Liberty University guidance)",
  sourceUrl: "https://www.liberty.edu/residential/undergraduate/homeschool/",
} as const;

export function subjectLabel(key: NavigatorSubjectKey): string {
  const all = [...coreSubjectOptions, ...interestSubjectOptions];
  return all.find((option) => option.value === key)?.label ?? key;
}
