/**
 * Heritage Academy Fall 2026 High School Track.
 * Facts are drawn from The Heritage Foundation's official Academy pages
 * and the Student Programs outreach email (Kirsten Holmberg).
 */
export const heritageAcademy = {
  slug: "the-heritage-academy",
  listingId: "seed-heritage-academy",
  programName: "The Heritage Academy",
  trackName: "High School Track",
  sponsor: "The Heritage Foundation",
  center: "Phillip N. Truluck Center for Leadership Development",
  eyebrow: "Fall 2026 High School Track",
  headline: "Know a student who would enjoy the Heritage Academy?",
  subtext:
    "A free virtual High School Track on America's founding principles and the public policy questions shaping our future.",
  shortDescription:
    "Free virtual High School Track on founding principles, the conservative movement, and public policy. Apply by September 13.",
  description:
    "The Heritage Academy is a free, virtual, eight-week fellowship from The Heritage Foundation. The Fall 2026 High School Track runs September 28 through November 23. Students learn America's founding principles, the conservative movement, and the public policy issues shaping the country, then meet peers who share those values in live small-group discussions. A typical week is two 30-minute on-demand lectures plus one live session, about 2 to 3 hours total. Applications close September 13, 2026.",
  programDatesLabel: "September 28 to November 23, 2026",
  programStart: "2026-09-28",
  programEnd: "2026-11-23",
  deadlineLabel: "September 13, 2026",
  deadlineIso: "2026-09-13",
  weeklyTime: "2 to 3 hours each week",
  costLabel: "Free",
  formatLabel: "Virtual, nationwide",
  applyUrl: "https://www.heritage.org/the-academy",
  learnMoreUrl: "https://www.heritage.org/the-academy",
  faqUrl: "https://www.heritage.org/academy-faq",
  fellowshipUrl: "https://www.heritage.org/high-school-fellowship",
  contactEmail: "theacademy@heritage.org",
  logoUrl: "/logos/heritage-foundation.png",
  heroImageUrl: "/heritage-academy/hero.jpg",
  studyImageUrl: "/heritage-academy/study.jpg",
  familyNote: {
    label: "From a Lighthouse family",
    quote:
      "Our son completed the Heritage Academy and loved it. When Heritage Student Programs asked us to share the Fall 2026 High School Track, we said yes.",
    attribution: "A Homeschool Lighthouse parent",
  },
  disclosure:
    "This is a Homeschool Lighthouse advertisement for The Heritage Foundation's Heritage Academy, prepared for their review. Program facts come from Heritage's official Academy pages and a request from their Student Programs team.",
} as const;

export const heritageAcademyFacts = [
  { label: "Program", value: heritageAcademy.programDatesLabel },
  { label: "Apply by", value: heritageAcademy.deadlineLabel },
  { label: "Weekly time", value: heritageAcademy.weeklyTime },
  { label: "Tuition", value: heritageAcademy.costLabel },
] as const;

export const heritageAcademyIncludes = [
  {
    title: "Sixteen on-demand lectures",
    body: "Heritage experts walk through founding principles and the policy questions students are meeting in class and in the news.",
  },
  {
    title: "Four live Q&A sessions",
    body: "Ask national conservative leaders directly. Miss a live hour? Watch the recording and still receive credit.",
  },
  {
    title: "High school discussion groups",
    body: "Meet students from across the country who share conservative values, not only a comment thread.",
  },
  {
    title: "A week that still fits homeschool",
    body: "Two 30-minute lectures plus one live session is the usual rhythm. About 2 to 3 hours, start to finish.",
  },
] as const;

export const heritageAcademyFaqs = [
  {
    question: "Who should apply?",
    answer:
      "The High School Track is for high school students who want a firmer grasp of America's founding, conservative ideas, and public policy, and who want friends who share those values. Heritage has hosted Academy fellows from all 50 states and more than 40 countries.",
  },
  {
    question: "How much time does it take?",
    answer:
      "Fellows usually spend 2 to 3 hours a week: two 30-minute recorded lectures and one live session. Small-group conversations are the piece Heritage most wants students to attend in real time.",
  },
  {
    question: "What if we miss a live session?",
    answer:
      "Live Q&As can be watched later for the same credit, and questions can be sent in advance. Small groups are not recorded. If a student cannot attend, Heritage offers a short makeup assignment for credit.",
  },
  {
    question: "When do families hear back?",
    answer:
      "Heritage reviews applications in the two weeks before the program begins. Fall 2026 starts September 28.",
  },
  {
    question: "Is there a cost?",
    answer: "No. The Heritage Academy is a free program.",
  },
  {
    question: "What can come after the Academy?",
    answer:
      "Many High School Track fellows later join Heritage's in-person summer High School Fellowship in Washington, D.C. The Academy is not required, but it is a natural next step.",
  },
] as const;

export function isHeritageAcademyListing(slug: string) {
  return slug === heritageAcademy.slug;
}
