export type NavigatorGradeLevel =
  | "8th"
  | "9th"
  | "10th"
  | "11th"
  | "12th"
  | "ungraded";

export type NavigatorLearningStyle =
  | "visual"
  | "auditory"
  | "kinesthetic"
  | "reading_writing"
  | "mixed";

export type NavigatorDelivery =
  | "online"
  | "hybrid"
  | "in_home"
  | "coop";

export type NavigatorPriceRange =
  | "free_budget"
  | "under_50"
  | "50_150"
  | "150_400"
  | "400_plus"
  | "flexible";

export type NavigatorFaithPreference =
  | "christian"
  | "catholic"
  | "jewish"
  | "muslim"
  | "secular"
  | "open";

export type NavigatorGradingStyle = "self_grading" | "instructor_grading" | "mixed";

export type NavigatorTechPreference =
  | "computer_tech"
  | "paper_offline"
  | "balanced";

export type NavigatorGroupStyle = "one_on_one" | "siblings_group" | "coop_group" | "flexible";

export type NavigatorWritingLevel =
  | "building"
  | "solid"
  | "advanced"
  | "college_ready";

export type NavigatorSubjectKey =
  | "english"
  | "math"
  | "science"
  | "history"
  | "foreign_language"
  | "art"
  | "music"
  | "electives"
  | "college_prep"
  | "career_trade"
  | "physical_education"
  | "bible_worldview"
  | "computer_technology"
  | "life_skills";

export interface NavigatorProfileAnswers {
  firstName: string;
  age: string;
  gradeLevel: NavigatorGradeLevel | "";
  semestersUntilGraduation: string;
  coreSubjects: NavigatorSubjectKey[];
  interestSubjects: NavigatorSubjectKey[];
  learningStyles: NavigatorLearningStyle[];
  deliveryModes: NavigatorDelivery[];
  priceRange: NavigatorPriceRange | "";
  subjectStrengths: string[];
  subjectImprovements: string[];
  careerTradePotentials: string[];
  personalityTraits: string[];
  gradingStyle: NavigatorGradingStyle | "";
  writingLevel: NavigatorWritingLevel | "";
  techPreference: NavigatorTechPreference | "";
  faithPreference: NavigatorFaithPreference | "";
  groupStyle: NavigatorGroupStyle | "";
  collegeGoals: string;
  additionalNotes: string;
}

export interface NavigatorChoice {
  rank: 1 | 2 | 3;
  title: string;
  slug: string;
  href: string;
  listingType: string;
  format: string;
  creditHint: string;
  reason: string;
  websiteUrl: string;
}

export interface NavigatorSubjectPlan {
  subjectKey: NavigatorSubjectKey;
  subjectLabel: string;
  recommendedCredits: string;
  libertyNote?: string;
  choices: NavigatorChoice[];
}

export interface NavigatorChart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  answers: NavigatorProfileAnswers;
  completionPercent: number;
  subjectPlans: NavigatorSubjectPlan[];
  encouragement: string;
}

export interface NavigatorEntitlement {
  hasAccess: boolean;
  purchasedAt?: string | null;
  stripePaymentId?: string | null;
}
