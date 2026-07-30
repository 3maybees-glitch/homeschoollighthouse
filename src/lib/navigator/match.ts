import { getAllListings } from "@/lib/listings/catalog";
import { agesOverlap, getGradeBand, resolveLearnerAge } from "@/lib/navigator/grades";
import {
  bandGuidanceNote,
  subjectLabel,
  subjectScopeHint,
} from "@/lib/navigator/survey";
import type { Listing } from "@/types/listing";
import type {
  NavigatorChoice,
  NavigatorProfileAnswers,
  NavigatorSubjectKey,
  NavigatorSubjectPlan,
} from "@/types/navigator";

const SUBJECT_TO_LISTING_TAGS: Record<NavigatorSubjectKey, string[]> = {
  english: ["language_arts", "reading", "writing", "english"],
  math: ["math"],
  science: ["science"],
  history: ["history"],
  foreign_language: ["foreign_language"],
  art: ["art"],
  music: ["music"],
  electives: ["electives", "art", "music"],
  college_prep: ["college_prep", "standardized_testing", "clt", "sat", "act", "psat", "ap_exams"],
  career_trade: ["electives", "college_prep"],
  physical_education: ["electives"],
  bible_worldview: ["history", "language_arts", "electives"],
  computer_technology: ["electives", "college_prep"],
  life_skills: ["electives"],
};

function priceScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  const min = listing.priceMin ?? 0;
  const max = listing.priceMax ?? listing.priceMin ?? 0;
  const avg = (min + max) / 2 || (listing.priceType === "free" ? 0 : 100);

  switch (answers.priceRange) {
    case "free_budget":
      return listing.priceType === "free" || avg <= 25 ? 12 : avg <= 75 ? 4 : -6;
    case "under_50":
      return avg <= 50 ? 10 : avg <= 100 ? 3 : -4;
    case "50_150":
      return avg >= 40 && avg <= 180 ? 10 : 2;
    case "150_400":
      return avg >= 120 && avg <= 450 ? 10 : 2;
    case "400_plus":
      return avg >= 300 || listing.listingType === "online_course" ? 10 : 3;
    case "flexible":
      return 4;
    default:
      return 0;
  }
}

function formatScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  let score = 0;
  for (const mode of answers.deliveryModes) {
    if (mode === "online" && (listing.format === "online" || listing.isVirtual)) score += 6;
    if (mode === "hybrid" && listing.format === "hybrid") score += 7;
    if (mode === "in_home" && (listing.format === "online" || listing.listingType === "curriculum"))
      score += 5;
    if (mode === "coop" && (listing.listingType === "coop" || listing.format === "in_person"))
      score += 7;
  }
  return score;
}

function faithScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  const faith = answers.faithPreference;
  if (!faith || faith === "open") return 2;
  if (faith === "secular") {
    if (listing.religions.includes("secular") || listing.philosophies.includes("secular")) return 10;
    if (listing.religions.some((r) => ["christian", "catholic", "jewish", "muslim"].includes(r)))
      return -4;
    return 3;
  }
  if (listing.religions.includes(faith)) return 12;
  if (listing.philosophies.includes("religious") && faith === "christian") return 6;
  return 0;
}

function styleScore(listing: Listing, answers: NavigatorProfileAnswers): number {
  let score = 0;
  const hay = `${listing.title} ${listing.description} ${listing.values.join(" ")}`.toLowerCase();

  if (answers.techPreference === "paper_offline") {
    if (listing.values.includes("screen_free") || hay.includes("print") || hay.includes("workbook"))
      score += 8;
    if (listing.format === "online" && !listing.values.includes("parent_led")) score -= 2;
  }
  if (answers.techPreference === "computer_tech") {
    if (listing.values.includes("tech_friendly") || listing.format === "online") score += 7;
  }
  if (answers.techPreference === "balanced") score += 2;

  if (answers.gradingStyle === "self_grading") {
    if (listing.values.includes("parent_led") || listing.values.includes("self_paced")) score += 6;
  }
  if (answers.gradingStyle === "instructor_grading") {
    if (listing.listingType === "online_course" || listing.listingType === "tutor") score += 7;
  }

  if (answers.learningStyles.includes("kinesthetic") && hay.includes("lab")) score += 4;
  if (answers.learningStyles.includes("visual") && (hay.includes("video") || hay.includes("visual")))
    score += 3;
  if (answers.learningStyles.includes("reading_writing") && listing.listingType === "curriculum")
    score += 3;

  if (answers.groupStyle === "coop_group" && listing.listingType === "coop") score += 6;
  if (answers.groupStyle === "one_on_one" && listing.values.includes("parent_led")) score += 4;
  if (answers.groupStyle === "siblings_group" && listing.values.includes("self_paced")) score += 4;

  if (answers.writingLevel === "college_ready" || answers.writingLevel === "advanced") {
    if (hay.includes("honors") || hay.includes("ap ") || hay.includes("college")) score += 5;
  }
  if (answers.writingLevel === "building") {
    if (hay.includes("foundational") || hay.includes("gentle") || hay.includes("introduction"))
      score += 4;
  }

  return score;
}

function subjectOverlap(listing: Listing, subjectKey: NavigatorSubjectKey): number {
  const tags = SUBJECT_TO_LISTING_TAGS[subjectKey];
  let score = 0;
  for (const tag of tags) {
    if (listing.subjects.includes(tag)) score += 10;
  }
  const label = subjectLabel(subjectKey).toLowerCase();
  const hay = `${listing.title} ${listing.shortDescription}`.toLowerCase();
  if (hay.includes(label.split(" ")[0]!)) score += 4;
  if (subjectKey === "bible_worldview" && listing.religions.includes("christian")) score += 6;
  if (subjectKey === "career_trade" && (hay.includes("career") || hay.includes("trade"))) score += 8;
  if (subjectKey === "computer_technology" && (hay.includes("computer") || hay.includes("coding")))
    score += 8;
  if (subjectKey === "physical_education" && (hay.includes("pe ") || hay.includes("physical")))
    score += 8;
  if (subjectKey === "life_skills" && (hay.includes("life skill") || hay.includes("home ec")))
    score += 8;
  return score;
}

function typeBoost(listing: Listing): number {
  if (listing.listingType === "curriculum") return 5;
  if (listing.listingType === "online_course") return 4;
  if (listing.listingType === "supplement") return 2;
  if (listing.listingType === "standardized_test") return 3;
  return 1;
}

function scoreForSubject(
  listing: Listing,
  subjectKey: NavigatorSubjectKey,
  answers: NavigatorProfileAnswers,
): number {
  const overlap = subjectOverlap(listing, subjectKey);
  if (overlap <= 0 && listing.listingType !== "curriculum" && listing.listingType !== "online_course") {
    return 0;
  }

  let score =
    overlap +
    priceScore(listing, answers) +
    formatScore(listing, answers) +
    faithScore(listing, answers) +
    styleScore(listing, answers) +
    typeBoost(listing) +
    listing.ratingAvg * 1.5 +
    agesOverlap(
      resolveLearnerAge(answers),
      answers.gradeLevel,
      listing.ageMin,
      listing.ageMax,
    );

  if (listing.isFeatured) score += 2;

  const band = getGradeBand(answers.gradeLevel);
  const hay = `${listing.title} ${listing.description}`.toLowerCase();
  if (band === "elementary") {
    if (hay.includes("elementary") || hay.includes("phonics") || hay.includes("primary")) score += 5;
    if (hay.includes("ap exam") || hay.includes("sat ") || hay.includes("act ")) score -= 6;
  }
  if (band === "middle") {
    if (hay.includes("middle") || hay.includes("junior high")) score += 4;
  }
  if (band === "high") {
    if (hay.includes("high school") || hay.includes("honors") || hay.includes("credit")) score += 4;
  }

  const strengthHit = answers.subjectStrengths.some((s) =>
    listing.title.toLowerCase().includes(s.toLowerCase().split(" ")[0] ?? ""),
  );
  const improveHit = answers.subjectImprovements.some((s) =>
    SUBJECT_TO_LISTING_TAGS[subjectKey].some((tag) => s.toLowerCase().includes(tag.replace("_", " "))),
  );
  if (strengthHit) score += 2;
  if (improveHit) score += 3;

  return score;
}

function buildReason(
  listing: Listing,
  subjectKey: NavigatorSubjectKey,
  answers: NavigatorProfileAnswers,
): string {
  const parts: string[] = [];
  if (listing.format) parts.push(`${listing.format.replace("_", "-")} delivery`);
  if (answers.faithPreference && answers.faithPreference !== "open") {
    if (listing.religions.includes(answers.faithPreference) || answers.faithPreference === "secular")
      parts.push("aligns with your faith / standards preference");
  }
  if (listing.values.includes("self_paced")) parts.push("self-paced friendly");
  if (listing.values.includes("parent_led")) parts.push("parent-led grading ready");
  if (listing.listingType === "online_course") parts.push("instructor-supported option");
  if (answers.priceRange === "free_budget" && listing.priceType === "free") parts.push("budget-friendly");
  if (subjectKey === "college_prep") parts.push("supports readiness for the next stage");
  return parts.slice(0, 3).join(" · ") || "strong overall fit for this subject chart";
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
    slug: listing.slug,
    href: `${siteUrl}/listing/${listing.slug}`,
    listingType: listing.listingType,
    format: listing.format,
    creditHint: subjectScopeHint(subjectKey, answers.gradeLevel),
    reason: buildReason(listing, subjectKey, answers),
    websiteUrl: listing.websiteUrl,
  };
}

export function buildSubjectPlans(answers: NavigatorProfileAnswers): NavigatorSubjectPlan[] {
  const listings = getAllListings().filter(
    (listing) =>
      ["curriculum", "online_course", "supplement", "standardized_test", "coop", "tutor"].includes(
        listing.listingType,
      ),
  );

  const subjects = Array.from(
    new Set([...answers.coreSubjects, ...answers.interestSubjects]),
  ) as NavigatorSubjectKey[];

  if (!subjects.length) {
    return (["english", "math", "science", "history"] as NavigatorSubjectKey[]).map((key) =>
      planForSubject(key, answers, listings),
    );
  }

  return subjects.map((key) => planForSubject(key, answers, listings));
}

function planForSubject(
  subjectKey: NavigatorSubjectKey,
  answers: NavigatorProfileAnswers,
  listings: Listing[],
): NavigatorSubjectPlan {
  const ranked = listings
    .map((listing) => ({ listing, score: scoreForSubject(listing, subjectKey, answers) }))
    .filter((item) => item.score > 4)
    .sort((a, b) => b.score - a.score);

  const picks: Listing[] = [];
  for (const item of ranked) {
    if (picks.some((p) => p.slug === item.listing.slug)) continue;
    picks.push(item.listing);
    if (picks.length >= 3) break;
  }

  // Fallback: featured curricula if matching is thin
  if (picks.length < 3) {
    for (const listing of listings) {
      if (picks.some((p) => p.slug === listing.slug)) continue;
      if (listing.isFeatured || listing.listingType === "curriculum") {
        picks.push(listing);
      }
      if (picks.length >= 3) break;
    }
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

export function buildEncouragement(answers: NavigatorProfileAnswers): string {
  const name = answers.firstName.trim() || "your sailor";
  const horizon = answers.semestersUntilGraduation.trim();
  const band = getGradeBand(answers.gradeLevel);
  const gradeLabel = answers.gradeLevel ? ` (grade ${answers.gradeLevel})` : "";
  const bandPhrase =
    band === "elementary"
      ? "elementary years"
      : band === "middle"
        ? "middle-school years"
        : band === "high"
          ? "high school voyage"
          : "learning voyage";
  const horizonPhrase = horizon
    ? `With about ${horizon} still ahead on the ${bandPhrase}`
    : `Charting the ${bandPhrase}${gradeLabel}`;
  return `${horizonPhrase}, ${name}'s recommendations are ready to light the way — from today's lessons toward 12th-grade graduation. Three trusted choices per subject give you room to compare, pray over, and choose — then update anytime the winds shift. You are not alone on this voyage.`;
}
