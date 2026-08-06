import { getAllListings } from "@/lib/listings/catalog";
import {
  agesOverlap,
  companyFromListing,
  getGradeBand,
  gradeAgeRanges,
  gradeDisplayLabel,
  resolveLearnerAge,
  resolveVoyageGrades,
  type NavigatorGradeBand,
} from "@/lib/navigator/grades";
import {
  bandGuidanceNote,
  subjectLabel,
  subjectScopeHint,
} from "@/lib/navigator/survey";
import type { Listing } from "@/types/listing";
import type {
  NavigatorChoice,
  NavigatorGradeLevel,
  NavigatorProfileAnswers,
  NavigatorSubjectKey,
  NavigatorSubjectPlan,
  NavigatorYearPlan,
} from "@/types/navigator";

/** Subject tags + rich keyword banks so we match by meaning, not catalog order. */
const SUBJECT_SIGNALS: Record<
  NavigatorSubjectKey,
  { tags: string[]; keywords: string[]; preferTypes: Listing["listingType"][] }
> = {
  english: {
    tags: ["language_arts", "reading", "writing", "english"],
    keywords: [
      "english",
      "language arts",
      "ela",
      "literature",
      "writing",
      "composition",
      "grammar",
      "reading",
      "phonics",
      "spelling",
      "vocabulary",
      "essay",
      "iew",
      "brave writer",
      "writeshop",
    ],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  math: {
    tags: ["math"],
    keywords: [
      "math",
      "mathematics",
      "algebra",
      "geometry",
      "calculus",
      "arithmetic",
      "pre-algebra",
      "prealgebra",
      "math-u-see",
      "saxon",
      "teaching textbooks",
      "singapore",
      "rightstart",
      "beast academy",
    ],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  science: {
    tags: ["science"],
    keywords: [
      "science",
      "biology",
      "chemistry",
      "physics",
      "nature",
      "lab",
      "apologia",
      "life science",
      "earth science",
      "anatomy",
      "astronomy",
    ],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  history: {
    tags: ["history"],
    keywords: [
      "history",
      "social studies",
      "civics",
      "geography",
      "government",
      "world history",
      "american history",
      "notgrass",
      "story of the world",
      "mystery of history",
      "beautiful feet",
    ],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  foreign_language: {
    tags: ["foreign_language"],
    keywords: [
      "spanish",
      "french",
      "latin",
      "german",
      "language",
      "rosetta",
      "homeschool languages",
      "foreign language",
      "asl",
      "greek",
      "hebrew",
    ],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  art: {
    tags: ["art"],
    keywords: ["art", "drawing", "painting", "artistic", "fine arts", "crafts"],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  music: {
    tags: ["music"],
    keywords: ["music", "piano", "choir", "band", "orchestra", "theory time", "violin"],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  electives: {
    tags: ["electives", "art", "music"],
    keywords: ["elective", "enrichment", "hobby", "club", "interest"],
    preferTypes: ["curriculum", "online_course", "supplement", "coop"],
  },
  college_prep: {
    tags: ["college_prep", "standardized_testing", "clt", "sat", "act", "psat", "ap_exams"],
    keywords: ["sat", "act", "clt", "psat", "college prep", "ap exam", "test prep", "dual enrollment"],
    preferTypes: ["standardized_test", "online_course", "curriculum", "supplement"],
  },
  career_trade: {
    tags: ["electives", "college_prep"],
    keywords: ["career", "trade", "cte", "vocational", "entrepreneur", "business", "coding", "welding"],
    preferTypes: ["online_course", "curriculum", "supplement", "coop"],
  },
  physical_education: {
    tags: ["electives"],
    keywords: ["physical education", "pe ", "fitness", "health", "sports", "movement", "exercise"],
    preferTypes: ["curriculum", "online_course", "supplement", "coop"],
  },
  bible_worldview: {
    tags: ["history", "language_arts", "electives"],
    keywords: ["bible", "theology", "worldview", "apologetics", "scripture", "christian living", "discipleship"],
    preferTypes: ["curriculum", "online_course", "supplement"],
  },
  computer_technology: {
    tags: ["electives", "college_prep"],
    keywords: ["computer", "coding", "programming", "technology", "typing", "keyboarding", "stem", "robotics"],
    preferTypes: ["online_course", "curriculum", "supplement"],
  },
  life_skills: {
    tags: ["electives"],
    keywords: ["life skills", "home economics", "home ec", "cooking", "finance", "practical life", "homemaking"],
    preferTypes: ["curriculum", "online_course", "supplement", "coop"],
  },
};

const STRENGTH_KEYWORDS: Record<string, string[]> = {
  "Phonics & early reading": ["phonics", "reading", "beginning reader", "early literacy"],
  "Reading comprehension": ["reading", "comprehension", "literature"],
  "Handwriting / penmanship": ["handwriting", "penmanship", "cursive"],
  "English & writing": ["writing", "english", "composition", "grammar"],
  "Spelling & vocabulary": ["spelling", "vocabulary"],
  "Early / elementary math": ["math", "arithmetic", "elementary math", "number"],
  "Algebra & math": ["algebra", "math"],
  Geometry: ["geometry", "math"],
  "Nature study / life science": ["nature", "life science", "science"],
  "Biology / life science": ["biology", "life science"],
  "Chemistry / physical science": ["chemistry", "physics", "physical science"],
  "History & civics": ["history", "civics", "government"],
  Geography: ["geography"],
  "Foreign language": ["spanish", "french", "latin", "language"],
  "Fine arts": ["art", "music", "drawing"],
  "Organization & study skills": ["study skills", "executive function", "organization"],
  "Public speaking": ["speech", "public speaking", "debate"],
  "Research & essays": ["essay", "research", "writing", "composition"],
};

function listingHaystack(listing: Listing): string {
  return [
    listing.title,
    listing.shortDescription,
    listing.description,
    listing.listingType,
    ...listing.subjects,
    ...listing.philosophies,
    ...listing.values,
    ...listing.religions,
  ]
    .join(" ")
    .toLowerCase();
}

function keywordHits(hay: string, keywords: string[]): number {
  let hits = 0;
  for (const keyword of keywords) {
    if (hay.includes(keyword.toLowerCase())) hits += 1;
  }
  return hits;
}

function subjectRelevance(listing: Listing, subjectKey: NavigatorSubjectKey): number {
  const signals = SUBJECT_SIGNALS[subjectKey];
  const hay = listingHaystack(listing);
  let score = 0;

  for (const tag of signals.tags) {
    if (listing.subjects.includes(tag)) score += 18;
  }

  const hits = keywordHits(hay, signals.keywords);
  score += Math.min(hits * 7, 35);

  if (signals.preferTypes.includes(listing.listingType)) score += 8;
  if (listing.listingType === "curriculum" && hits > 0) score += 6;

  // Penalize obvious mismatches for core academics.
  if (["english", "math", "science", "history"].includes(subjectKey)) {
    if (listing.listingType === "coop" && hits === 0) score -= 10;
    if (listing.listingType === "tutor" && hits === 0) score -= 6;
  }

  return score;
}

function priceScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  const min = listing.priceMin ?? 0;
  const max = listing.priceMax ?? listing.priceMin ?? 0;
  const avg = (min + max) / 2 || (listing.priceType === "free" ? 0 : 120);

  switch (answers.priceRange) {
    case "free_budget":
      return listing.priceType === "free" || avg <= 25 ? 16 : avg <= 60 ? 4 : -10;
    case "under_50":
      return avg <= 50 ? 14 : avg <= 90 ? 4 : -6;
    case "50_150":
      return avg >= 35 && avg <= 180 ? 14 : avg < 35 ? 6 : 2;
    case "150_400":
      return avg >= 120 && avg <= 450 ? 14 : 3;
    case "400_plus":
      return avg >= 280 || listing.listingType === "online_course" ? 14 : 3;
    case "flexible":
      return 5;
    default:
      return 0;
  }
}

function formatScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  let score = 0;
  for (const mode of answers.deliveryModes) {
    if (mode === "online" && (listing.format === "online" || listing.isVirtual)) score += 10;
    if (mode === "hybrid" && listing.format === "hybrid") score += 12;
    if (mode === "hybrid" && listing.format === "online") score += 4;
    if (mode === "in_home" && listing.listingType === "curriculum") score += 10;
    if (mode === "in_home" && listing.values.includes("parent_led")) score += 6;
    if (mode === "coop" && (listing.listingType === "coop" || listing.format === "in_person"))
      score += 12;
  }
  return score;
}

function faithScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  const faith = answers.faithPreference;
  if (!faith || faith === "open") return 2;
  if (faith === "secular") {
    if (listing.religions.includes("secular") || listing.philosophies.includes("secular")) return 16;
    if (listing.religions.some((r) => ["christian", "catholic", "jewish", "muslim"].includes(r)))
      return -12;
    return 2;
  }
  if (listing.religions.includes(faith)) return 18;
  if (listing.philosophies.includes("religious") && faith === "christian") return 10;
  if (listing.religions.includes("secular")) return -4;
  return 0;
}

function styleScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  let score = 0;
  const hay = listingHaystack(listing);

  if (answers.techPreference === "paper_offline") {
    if (listing.values.includes("screen_free") || hay.includes("print") || hay.includes("workbook"))
      score += 12;
    if (listing.format === "online" && !listing.values.includes("parent_led")) score -= 5;
  }
  if (answers.techPreference === "computer_tech") {
    if (listing.values.includes("tech_friendly") || listing.format === "online") score += 11;
  }
  if (answers.techPreference === "balanced") {
    if (listing.format === "hybrid" || hay.includes("video") || hay.includes("workbook")) score += 5;
  }

  if (answers.gradingStyle === "self_grading") {
    if (listing.values.includes("parent_led") || listing.values.includes("self_paced")) score += 10;
    if (listing.listingType === "curriculum") score += 4;
  }
  if (answers.gradingStyle === "instructor_grading") {
    if (listing.listingType === "online_course" || listing.listingType === "tutor") score += 12;
    if (hay.includes("teacher") || hay.includes("graded") || hay.includes("instructor")) score += 6;
  }
  if (answers.gradingStyle === "mixed") score += 3;

  if (answers.learningStyles.includes("kinesthetic")) {
    if (hay.includes("lab") || hay.includes("hands-on") || hay.includes("manipulative")) score += 8;
  }
  if (answers.learningStyles.includes("visual")) {
    if (hay.includes("video") || hay.includes("visual") || hay.includes("illustration")) score += 6;
  }
  if (answers.learningStyles.includes("auditory")) {
    if (hay.includes("audio") || hay.includes("lecture") || hay.includes("discussion")) score += 6;
  }
  if (answers.learningStyles.includes("reading_writing")) {
    if (listing.listingType === "curriculum" || hay.includes("literature") || hay.includes("notebook"))
      score += 6;
  }

  if (answers.groupStyle === "coop_group" && listing.listingType === "coop") score += 10;
  if (answers.groupStyle === "one_on_one" && listing.values.includes("parent_led")) score += 7;
  if (answers.groupStyle === "siblings_group" && listing.values.includes("self_paced")) score += 7;

  if (answers.writingLevel === "college_ready" || answers.writingLevel === "advanced") {
    if (hay.includes("honors") || hay.includes("ap ") || hay.includes("college")) score += 8;
  }
  if (answers.writingLevel === "building") {
    if (hay.includes("foundational") || hay.includes("gentle") || hay.includes("introduction") || hay.includes("phonics"))
      score += 8;
  }

  return score;
}

function bandScore(listing: Listing, band: NavigatorGradeBand): number {
  const hay = listingHaystack(listing);
  if (band === "elementary") {
    let score = 0;
    if (hay.includes("elementary") || hay.includes("phonics") || hay.includes("primary") || hay.includes("k-"))
      score += 12;
    if (hay.includes("grade 1") || hay.includes("grade 2") || hay.includes("grade 3") || hay.includes("1st"))
      score += 4;
    if (hay.includes("ap exam") || hay.includes("sat ") || hay.includes("act ") || hay.includes("algebra ii"))
      score -= 14;
    return score;
  }
  if (band === "middle") {
    let score = 0;
    if (hay.includes("middle") || hay.includes("junior high") || hay.includes("pre-algebra")) score += 10;
    if (hay.includes("ap exam") || hay.includes("sat prep")) score -= 6;
    return score;
  }
  if (band === "high") {
    let score = 0;
    if (hay.includes("high school") || hay.includes("honors") || hay.includes("credit") || hay.includes("algebra"))
      score += 10;
    if (hay.includes("preschool") || hay.includes("kindergarten") || hay.includes("early childhood"))
      score -= 12;
    return score;
  }
  return 0;
}

function profileThemeScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  const hay = listingHaystack(listing);
  let score = 0;

  for (const strength of answers.subjectStrengths) {
    const keys = STRENGTH_KEYWORDS[strength] ?? strength.toLowerCase().split(/\s+/);
    if (keywordHits(hay, keys) > 0) score += 3;
  }
  for (const area of answers.subjectImprovements) {
    const keys = STRENGTH_KEYWORDS[area] ?? area.toLowerCase().split(/\s+/);
    // Prefer resources that support growth areas more strongly than strengths.
    if (keywordHits(hay, keys) > 0) score += 7;
  }
  for (const career of answers.careerTradePotentials) {
    const token = career.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3);
    if (keywordHits(hay, token) > 0) score += 4;
  }

  if (answers.personalityTraits.includes("Needs encouragement & pacing")) {
    if (hay.includes("gentle") || hay.includes("self-paced") || hay.includes("mastery")) score += 5;
  }
  if (answers.personalityTraits.includes("Structured & routine-loving")) {
    if (hay.includes("lesson plan") || hay.includes("scheduled") || hay.includes("open-and-go")) score += 5;
  }
  if (answers.personalityTraits.includes("Creative & imaginative")) {
    if (hay.includes("literature") || hay.includes("art") || hay.includes("unit study")) score += 4;
  }
  if (answers.personalityTraits.includes("Independent & self-starting")) {
    if (listing.values.includes("self_paced") || hay.includes("independent")) score += 5;
  }

  const goals = answers.collegeGoals.toLowerCase();
  if (goals.includes("liberty") || goals.includes("christian university")) {
    if (listing.religions.includes("christian") || hay.includes("college")) score += 4;
  }
  if (goals.includes("dual enrollment")) {
    if (hay.includes("dual") || hay.includes("college")) score += 5;
  }
  if (goals.includes("trade") || goals.includes("career")) {
    if (hay.includes("career") || hay.includes("trade") || hay.includes("cte")) score += 5;
  }

  return score;
}

function qualityScore(listing: Listing): number {
  let score = listing.ratingAvg * 2.2;
  if (listing.ratingCount >= 5) score += 3;
  if (listing.ratingCount >= 20) score += 2;
  if (listing.isFeatured) score += 2;
  // Prefer substantial descriptions — thin import stubs are weaker signals.
  if ((listing.description?.length ?? 0) > 180) score += 3;
  if ((listing.shortDescription?.length ?? 0) > 40) score += 1;
  return score;
}

function scoreForSubject(
  listing: Listing,
  subjectKey: NavigatorSubjectKey,
  answers: NavigatorProfileAnswers,
  learnerAge: number | null,
): { score: number; relevance: number } {
  const relevance = subjectRelevance(listing, subjectKey);
  if (relevance < 8) {
    return { score: 0, relevance };
  }

  const band = getGradeBand(answers.gradeLevel);
  const score =
    relevance +
    priceScore(listing, answers) +
    formatScore(listing, answers) +
    faithScore(listing, answers) +
    styleScore(listing, answers) +
    bandScore(listing, band) +
    profileThemeScore(listing, answers) +
    qualityScore(listing) +
    agesOverlap(learnerAge, answers.gradeLevel, listing.ageMin, listing.ageMax);

  return { score, relevance };
}

function buildReason(
  listing: Listing,
  subjectKey: NavigatorSubjectKey,
  answers: NavigatorProfileAnswers,
): string {
  const parts: string[] = [];
  const hay = listingHaystack(listing);
  const signals = SUBJECT_SIGNALS[subjectKey];
  const hit = signals.keywords.find((keyword) => hay.includes(keyword));
  if (hit) parts.push(`strong ${hit} fit`);

  if (answers.faithPreference && answers.faithPreference !== "open") {
    if (listing.religions.includes(answers.faithPreference)) {
      parts.push(`matches ${answers.faithPreference} preference`);
    } else if (
      answers.faithPreference === "secular" &&
      (listing.religions.includes("secular") || listing.philosophies.includes("secular"))
    ) {
      parts.push("secular / neutral standards");
    }
  }

  if (answers.deliveryModes.includes("online") && listing.format === "online") {
    parts.push("online delivery");
  } else if (answers.deliveryModes.includes("in_home") && listing.listingType === "curriculum") {
    parts.push("home-led curriculum");
  } else if (listing.format) {
    parts.push(`${listing.format.replaceAll("_", "-")} format`);
  }

  if (answers.gradingStyle === "instructor_grading" && listing.listingType === "online_course") {
    parts.push("instructor-supported");
  } else if (answers.gradingStyle === "self_grading" && listing.values.includes("parent_led")) {
    parts.push("parent-grading friendly");
  }

  const improve = answers.subjectImprovements.find((area) => {
    const keys = STRENGTH_KEYWORDS[area] ?? [];
    return keywordHits(hay, keys) > 0;
  });
  if (improve) parts.push(`supports growth in ${improve.toLowerCase()}`);

  if (listing.ratingAvg >= 4.5 && listing.ratingCount >= 3) {
    parts.push(`highly rated (${listing.ratingAvg.toFixed(1)})`);
  }

  return parts.slice(0, 3).join(" · ") || "thoughtfully matched to this learner profile";
}

function toChoice(
  listing: Listing,
  rank: 1 | 2 | 3,
  subjectKey: NavigatorSubjectKey,
  answers: NavigatorProfileAnswers,
): NavigatorChoice {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://homeschoollighthouse.com";
  return {
    rank,
    title: listing.title,
    company: companyFromListing(listing.websiteUrl, listing.title),
    slug: listing.slug,
    href: `${siteUrl}/listing/${listing.slug}`,
    listingType: listing.listingType,
    format: listing.format,
    creditHint: subjectScopeHint(subjectKey, answers.gradeLevel),
    reason: buildReason(listing, subjectKey, answers),
    websiteUrl: listing.websiteUrl,
  };
}

function answersForGrade(
  base: NavigatorProfileAnswers,
  grade: NavigatorGradeLevel,
  yearOffset: number,
): NavigatorProfileAnswers {
  const baseAge = resolveLearnerAge(base);
  return {
    ...base,
    gradeLevel: grade,
    age: baseAge != null ? String(baseAge + yearOffset) : base.age,
  };
}

/**
 * Pick top 3 with company diversity and score-first ranking.
 * Avoids "first in list" fallbacks.
 */
function pickBestThree(
  ranked: { listing: Listing; score: number }[],
  usedSlugs: Set<string>,
): Listing[] {
  const picks: Listing[] = [];
  const usedCompanies = new Set<string>();

  const tryTake = (allowUsedSlug: boolean, allowSameCompany: boolean) => {
    for (const item of ranked) {
      if (picks.some((p) => p.slug === item.listing.slug)) continue;
      if (!allowUsedSlug && usedSlugs.has(item.listing.slug)) continue;
      const company = companyFromListing(item.listing.websiteUrl, item.listing.title).toLowerCase();
      if (!allowSameCompany && usedCompanies.has(company)) continue;
      picks.push(item.listing);
      usedCompanies.add(company);
      if (picks.length >= 3) return;
    }
  };

  // 1) Fresh + diverse companies
  tryTake(false, false);
  // 2) Allow reuse across years, keep company diversity
  if (picks.length < 3) tryTake(true, false);
  // 3) Fill remaining by pure score
  if (picks.length < 3) tryTake(true, true);

  return picks;
}

function planForSubject(
  subjectKey: NavigatorSubjectKey,
  answers: NavigatorProfileAnswers,
  listings: Listing[],
  usedSlugs: Set<string>,
): NavigatorSubjectPlan {
  const learnerAge = resolveLearnerAge(answers);

  const ranked = listings
    .map((listing) => {
      const { score, relevance } = scoreForSubject(listing, subjectKey, answers, learnerAge);
      return { listing, score, relevance };
    })
    .filter((item) => item.score > 20 && item.relevance >= 8)
    .sort((a, b) => b.score - a.score || b.relevance - a.relevance);

  // If profile filters were too strict, relax once — still score-ordered, never catalog order.
  const pool =
    ranked.length >= 3
      ? ranked
      : listings
          .map((listing) => {
            const { score, relevance } = scoreForSubject(listing, subjectKey, answers, learnerAge);
            return { listing, score, relevance };
          })
          .filter((item) => item.relevance >= 6)
          .sort((a, b) => b.score - a.score);

  const picks = pickBestThree(
    pool.map(({ listing, score }) => ({ listing, score })),
    usedSlugs,
  );

  for (const listing of picks) {
    usedSlugs.add(listing.slug);
  }

  const choices = picks.slice(0, 3).map((listing, index) =>
    toChoice(listing, (index + 1) as 1 | 2 | 3, subjectKey, answers),
  );

  return {
    subjectKey,
    subjectLabel: subjectLabel(subjectKey),
    recommendedCredits: subjectScopeHint(subjectKey, answers.gradeLevel),
    libertyNote: bandGuidanceNote(subjectKey, answers.gradeLevel),
    choices,
  };
}

function subjectsForAnswers(answers: NavigatorProfileAnswers): NavigatorSubjectKey[] {
  const subjects = Array.from(
    new Set([...answers.coreSubjects, ...answers.interestSubjects]),
  ) as NavigatorSubjectKey[];
  return subjects.length ? subjects : ["english", "math", "science", "history"];
}

/** Legacy single-year helper (first voyage year). */
export function buildSubjectPlans(answers: NavigatorProfileAnswers): NavigatorSubjectPlan[] {
  const yearPlans = buildYearPlans(answers);
  return yearPlans[0]?.subjectPlans ?? [];
}

export function buildYearPlans(answers: NavigatorProfileAnswers): NavigatorYearPlan[] {
  const listings = getAllListings().filter((listing) =>
    ["curriculum", "online_course", "supplement", "standardized_test", "coop", "tutor"].includes(
      listing.listingType,
    ),
  );

  const voyageGrades = resolveVoyageGrades(answers);
  const subjects = subjectsForAnswers(answers);
  const usedSlugs = new Set<string>();
  const baseAge = resolveLearnerAge(answers);

  return voyageGrades.map((grade, index) => {
    const yearAnswers = answersForGrade(answers, grade, index);
    const subjectPlans = subjects.map((key) =>
      planForSubject(key, yearAnswers, listings, usedSlugs),
    );
    const ageHint =
      baseAge != null
        ? `About age ${baseAge + index}`
        : grade === "ungraded"
          ? "Age flexible"
          : `Typical ages ${gradeAgeHint(grade)}`;

    return {
      yearIndex: index + 1,
      gradeLevel: grade,
      gradeLabel: grade === "ungraded" ? `Voyage year ${index + 1}` : gradeDisplayLabel(grade),
      ageHint,
      subjectPlans,
    };
  });
}

function gradeAgeHint(grade: NavigatorGradeLevel): string {
  const [min, max] = gradeAgeRanges[grade];
  return `${min}–${max}`;
}

export function buildEncouragement(answers: NavigatorProfileAnswers): string {
  const name = answers.firstName.trim() || "your sailor";
  const years = resolveVoyageGrades(answers);
  const yearCount = years.length;
  const last = years[years.length - 1];
  const endLabel =
    last && last !== "ungraded" ? gradeDisplayLabel(last) : "12th-grade graduation";

  return `${name}'s multi-year chart covers ${yearCount} school year${yearCount === 1 ? "" : "s"} — from ${
    answers.gradeLevel ? gradeDisplayLabel(answers.gradeLevel as NavigatorGradeLevel) : "this year"
  } through ${endLabel}. Each year lists three thoughtfully matched choices per subject — ranked for fit, not catalog order — so you can compare, pray over, and choose. Update anytime the winds shift. You are not alone on this voyage.`;
}
