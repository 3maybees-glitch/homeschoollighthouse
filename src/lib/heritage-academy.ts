/**
 * Heritage Academy Fall 2026.
 * Facts from The Heritage Foundation official Academy pages, Student Programs
 * email (Kirsten Holmberg), and Heritage's 2026 marketing flyers / PDF.
 */
export const heritageAcademy = {
  slug: "the-heritage-academy",
  listingId: "seed-heritage-academy",
  programName: "The Heritage Academy",
  trackName: "High School Track",
  sponsor: "The Heritage Foundation",
  center: "Phillip N. Truluck Center for Leadership Development",
  tagline: "An online public policy fellowship",
  eyebrow: "Fall 2026 High School Track",
  headline: "Know a student who would enjoy the Heritage Academy?",
  subtext:
    "A free virtual High School Track on America's founding principles and the public policy questions shaping our future.",
  shortDescription:
    "Free virtual High School Track on founding principles, the conservative movement, and public policy. Apply by September 13.",
  description:
    "The Heritage Academy is a free, eight-week online public policy fellowship from The Heritage Foundation. The Fall 2026 High School Track runs September 28 through November 23. Students learn America's founding principles, the history of the conservative movement, and the most pressing public policy issues of our time, then meet peers who share those values in live small-group discussions. A typical week is two 30-minute on-demand lectures plus one live session, about 2 to 3 hours total. Applications close September 13, 2026.",
  programDatesLabel: "September 28 to November 23, 2026",
  programStart: "2026-09-28",
  programEnd: "2026-11-23",
  deadlineLabel: "September 13, 2026",
  deadlineShort: "September 13",
  deadlineIso: "2026-09-13",
  weeklyTime: "2 to 3 hours each week",
  costLabel: "Free",
  formatLabel: "Virtual, nationwide",
  applyUrl: "https://www.heritage.org/heritage-academy",
  learnMoreUrl: "https://www.heritage.org/the-academy",
  faqUrl: "https://www.heritage.org/academy-faq",
  fellowshipUrl: "https://www.heritage.org/high-school-fellowship",
  contactEmail: "theacademy@heritage.org",
  logoUrl: "/logos/heritage-foundation.png",
  flyerPdfUrl: "/heritage-academy/flyers/heritage-academy-flyer-2026.pdf",
  flyers: {
    deadlineBell: {
      src: "/heritage-academy/flyers/deadline-bell.webp",
      alt: "Heritage Academy flyer: an online public policy fellowship, applications now open, apply by September 13",
      width: 1200,
      height: 1500,
    },
    lectureLaptop: {
      src: "/heritage-academy/flyers/lecture-laptop.webp",
      alt: "Heritage Academy flyer showing an online lecture with Dr. Kevin Roberts, apply by September 13",
      width: 1200,
      height: 1500,
    },
    deadlineEagle: {
      src: "/heritage-academy/flyers/deadline-eagle.webp",
      alt: "Heritage Academy flyer with eagle mark: applications now open, apply by September 13",
      width: 1200,
      height: 1200,
    },
  },
  familyNote: {
    label: "From a Lighthouse family",
    quote:
      "Our son completed the Heritage Academy and loved it. When Heritage Student Programs asked us to share the Fall 2026 High School Track, we said yes.",
    attribution: "A Homeschool Lighthouse parent",
  },
  disclosure:
    "This is a Homeschool Lighthouse advertisement for The Heritage Foundation's Heritage Academy, prepared for their review. Program facts and artwork come from Heritage's official Academy pages, 2026 marketing flyers, and a request from their Student Programs team.",
} as const;

export const heritageAcademyFacts = [
  { label: "Program", value: heritageAcademy.programDatesLabel },
  { label: "Apply by", value: heritageAcademy.deadlineLabel },
  { label: "Weekly time", value: heritageAcademy.weeklyTime },
  { label: "Tuition", value: heritageAcademy.costLabel },
] as const;

export const heritageAcademyIncludes = [
  {
    title: "On-demand policy lectures",
    body: "Learn from America's leading policy experts. Lectures cover founding principles and the issues students are meeting now.",
  },
  {
    title: "Live Q&A sessions",
    body: "Interact with leaders in the conservative movement. Miss a live hour? Watch the recording and still receive credit.",
  },
  {
    title: "Small-group discussions",
    body: "Connect with conservatives from across America, including a dedicated High School Track.",
  },
  {
    title: "A week that still fits homeschool",
    body: "Two 30-minute lectures plus one live session is the usual rhythm. About 2 to 3 hours, start to finish.",
  },
] as const;

export const heritageAcademyLectures = [
  "America's Founding",
  "The History of American Conservatism",
  "The Gender Ideology Takeover",
  "Immigration and National Security",
  "Holding Big Tech Accountable",
  "Defending Life",
] as const;

export const heritageAcademyTracks = [
  {
    title: "High School Students",
    body: "Meet like-minded students and learn how you can defend your values. This is the track Heritage asked us to share.",
  },
  {
    title: "College Students",
    body: "Gain the skills and contacts you need to land your first internship or job in the conservative movement.",
  },
  {
    title: "Professionals and Patriots",
    body: "Connect with other professionals and engaged conservatives from all walks of life.",
  },
] as const;

export const heritageAcademyFaqs = [
  {
    question: "Who should apply?",
    answer:
      "Heritage is looking for talented conservatives of all ages, with dedicated discussion tracks for high school students, college students, and professionals. The High School Track is the one we are featuring for homeschool families.",
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
