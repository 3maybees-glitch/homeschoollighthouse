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
import { getGradeBand, type NavigatorGradeBand } from "@/lib/navigator/grades";

export const NAVIGATOR_PRICE_LABEL = "$47";
export const NAVIGATOR_PRICE_CENTS = 4700;

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
  { value: "1st", label: "1st grade — Elementary" },
  { value: "2nd", label: "2nd grade — Elementary" },
  { value: "3rd", label: "3rd grade — Elementary" },
  { value: "4th", label: "4th grade — Elementary" },
  { value: "5th", label: "5th grade — Elementary" },
  { value: "6th", label: "6th grade — Middle" },
  { value: "7th", label: "7th grade — Middle" },
  { value: "8th", label: "8th grade — Middle" },
  { value: "9th", label: "9th — Freshman (High School)" },
  { value: "10th", label: "10th — Sophomore (High School)" },
  { value: "11th", label: "11th — Junior (High School)" },
  { value: "12th", label: "12th — Senior (High School)" },
  { value: "ungraded", label: "Ungraded / multi-age / flexible track" },
];

export const coreSubjectOptions: { value: NavigatorSubjectKey; label: string }[] = [
  { value: "english", label: "English / Language Arts / Reading" },
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "history", label: "History / Social Studies" },
  { value: "foreign_language", label: "Foreign Language" },
];

export const interestSubjectOptions: { value: NavigatorSubjectKey; label: string }[] = [
  { value: "art", label: "Art & Design" },
  { value: "music", label: "Music" },
  { value: "electives", label: "Enrichment / Electives" },
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
  "Phonics & early reading",
  "Reading comprehension",
  "Handwriting / penmanship",
  "English & writing",
  "Spelling & vocabulary",
  "Early / elementary math",
  "Algebra & math",
  "Geometry",
  "Nature study / life science",
  "Biology / life science",
  "Chemistry / physical science",
  "History & civics",
  "Geography",
  "Foreign language",
  "Fine arts",
  "Organization & study skills",
  "Public speaking",
  "Research & essays",
];

export const careerTradeOptions = [
  "Still exploring — foundational years",
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
  { value: "building", label: "Still building foundational writing / early literacy" },
  { value: "solid", label: "Solid grade-level writing" },
  { value: "advanced", label: "Advanced / honors-ready for their age" },
  { value: "college_ready", label: "College-ready essays & research (typically high school)" },
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
    subtitle:
      "Tell us who this academic chart is for — 1st grade through 12th grade Senior (or ungraded).",
    fields: ["firstName", "age", "gradeLevel", "semestersUntilGraduation"],
  },
  {
    id: "core",
    title: "Core subjects to chart",
    subtitle:
      "Select the core subjects you want three matched choices for. Elementary through high school all chart reading/language arts, math, science, and history — add language when ready.",
    fields: ["coreSubjects"],
  },
  {
    id: "interests",
    title: "Interests, enrichment & activities",
    subtitle:
      "Art, music, PE, Bible, tech, life skills, electives — and college/career paths when your sailor is ready.",
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
    title: "Interests, future paths & personality",
    subtitle:
      "For younger sailors, “still exploring” is perfect. Personality traits help us pace and enrich.",
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
    title: "Horizon & hopes",
    subtitle:
      "Share hopes for this year and beyond — joy in learning, high school credits, dual enrollment, trade paths, or college dreams.",
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

const ELEMENTARY_SCOPE: Record<NavigatorSubjectKey, string> = {
  english: "Full-year language arts / reading block",
  math: "Full-year math level for this grade",
  science: "Year of science / nature study",
  history: "Year of history / social studies",
  foreign_language: "Introductory / enrichment language",
  art: "Weekly art enrichment",
  music: "Weekly music enrichment",
  electives: "Enrichment block",
  college_prep: "Early skills & habits (optional)",
  career_trade: "Interest exploration (optional)",
  physical_education: "PE / movement / health",
  bible_worldview: "Bible / character / worldview",
  computer_technology: "Gentle tech / typing intro",
  life_skills: "Life skills / home helpers",
};

const MIDDLE_SCOPE: Record<NavigatorSubjectKey, string> = {
  english: "Full-year ELA · builds toward high school credits",
  math: "Full-year math · pre-algebra path when ready",
  science: "Full-year science · labs when possible",
  history: "Full-year history / civics",
  foreign_language: "Year of language · foundations for HS credit",
  art: "0.5–1.0 enrichment / elective",
  music: "0.5–1.0 enrichment / elective",
  electives: "Enrichment / elective block",
  college_prep: "Study skills & early prep",
  career_trade: "Interest / CTE exploration",
  physical_education: "PE / health",
  bible_worldview: "Bible / worldview",
  computer_technology: "Tech / coding intro",
  life_skills: "Life skills elective",
};

const HIGH_CREDIT: Record<NavigatorSubjectKey, string> = {
  english: "1.0 credit / year · aim for 4 total",
  math: "1.0 credit / year · aim for 3–4 total",
  science: "1.0 lab credit / year · aim for 3 total",
  history: "1.0 credit / year · aim for 3 total",
  foreign_language: "1.0 credit / year · aim for 2 of same language",
  art: "0.5–1.0 elective credit",
  music: "0.5–1.0 elective credit",
  electives: "0.5–1.0 elective credit",
  college_prep: "0.5–1.0 elective / prep credit",
  career_trade: "0.5–1.0 CTE / elective credit",
  physical_education: "0.5–1.0 PE / health credit",
  bible_worldview: "0.5–1.0 elective / worldview credit",
  computer_technology: "0.5–1.0 tech elective credit",
  life_skills: "0.5–1.0 life-skills elective",
};

export function subjectScopeHint(
  subjectKey: NavigatorSubjectKey,
  grade: NavigatorGradeLevel | "",
): string {
  const band = getGradeBand(grade);
  if (band === "elementary") return ELEMENTARY_SCOPE[subjectKey];
  if (band === "middle") return MIDDLE_SCOPE[subjectKey];
  if (band === "high") return HIGH_CREDIT[subjectKey];
  return MIDDLE_SCOPE[subjectKey];
}

export function bandGuidanceNote(
  subjectKey: NavigatorSubjectKey,
  grade: NavigatorGradeLevel | "",
): string | undefined {
  const band = getGradeBand(grade);
  if (band === "high" || band === "flexible") {
    const notes: Partial<Record<NavigatorSubjectKey, string>> = {
      english: libertyCreditGuidance.english,
      math: libertyCreditGuidance.math,
      science: libertyCreditGuidance.science,
      history: libertyCreditGuidance.history,
      foreign_language: libertyCreditGuidance.foreign_language,
      electives: libertyCreditGuidance.electives,
    };
    return notes[subjectKey];
  }
  if (band === "elementary") {
    const notes: Partial<Record<NavigatorSubjectKey, string>> = {
      english: "Elementary focus: phonics → fluency → comprehension, with gentle writing growth.",
      math: "Elementary focus: number sense, operations, and confidence before acceleration.",
      science: "Elementary focus: wonder, observation, and hands-on nature / simple experiments.",
      history: "Elementary focus: stories, timelines, geography, and civic awareness.",
      foreign_language: "Optional enrichment — songs, games, and exposure beat pressure.",
    };
    return notes[subjectKey];
  }
  const notes: Partial<Record<NavigatorSubjectKey, string>> = {
    english: "Middle years bridge elementary literacy into high school–ready writing.",
    math: "Middle years often prepare pre-algebra / Algebra I readiness.",
    science: "Middle years deepen labs and scientific thinking before HS lab credits.",
    history: "Middle years expand world & U.S. history before transcript credits begin.",
    foreign_language: "A strong middle-school start makes high school language credits easier.",
  };
  return notes[subjectKey];
}

export function subjectLabel(key: NavigatorSubjectKey): string {
  const all = [...coreSubjectOptions, ...interestSubjectOptions];
  return all.find((option) => option.value === key)?.label ?? key;
}

export function horizonLabel(band: NavigatorGradeBand): string {
  if (band === "elementary") return "Years remaining on the K–12 voyage";
  if (band === "middle") return "Years / semesters until high school graduation";
  if (band === "high") return "Years / semesters until graduation";
  return "Years / grades remaining until 12th-grade graduation";
}
