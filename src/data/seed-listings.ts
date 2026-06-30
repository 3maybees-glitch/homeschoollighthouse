import type { Listing, ListingFormat, ListingType, PriceType } from "@/types/listing";
import acellusImportedJson from "@/data/acellus-imported.json";
import allAboutLearningImportedJson from "@/data/all-about-learning-imported.json";
import amblesideOnlineImportedJson from "@/data/ambleside-online-imported.json";
import classicalConversationsImportedJson from "@/data/classical-conversations-imported.json";
import easyPeasyImportedJson from "@/data/easy-peasy-imported.json";
import homeschoolLanguagesImportedJson from "@/data/homeschool-languages-imported.json";
import breakingTheBarrierImportedJson from "@/data/breaking-the-barrier-imported.json";
import braveWriterImportedJson from "@/data/brave-writer-imported.json";
import calicoSpanishImportedJson from "@/data/calico-spanish-imported.json";
import spellingYouSeeImportedJson from "@/data/spelling-you-see-imported.json";
import spellingPowerImportedJson from "@/data/spelling-power-imported.json";
import sequentialSpellingImportedJson from "@/data/sequential-spelling-imported.json";
import essentialsInWritingImportedJson from "@/data/essentials-in-writing-imported.json";
import writeshopImportedJson from "@/data/writeshop-imported.json";
import writeathomeImportedJson from "@/data/writeathome-imported.json";
import artisticPursuitsImportedJson from "@/data/artistic-pursuits-imported.json";
import schoolhouseTeachersImportedJson from "@/data/schoolhouse-teachers-imported.json";
import freedomHomeschoolingImportedJson from "@/data/freedom-homeschooling-imported.json";
import miacademyImportedJson from "@/data/miacademy-imported.json";
import bjuPressImportedJson from "@/data/bju-press-imported.json";
import rosettaStoneImportedJson from "@/data/rosetta-stone-imported.json";
import masterbooksImportedJson from "@/data/masterbooks-imported.json";
import sonlightImportedJson from "@/data/sonlight-imported.json";
import homeSchoolImportedJson from "@/data/home-school-imported.json";
import hsldaImportedJson from "@/data/hslda-imported.json";
import wellTrainedMindImportedJson from "@/data/well-trained-mind-imported.json";
import homeschoolReviewsImportedJson from "@/data/homeschool-reviews-imported.json";
import secularHomeschoolImportedJson from "@/data/secular-homeschool-imported.json";
import theOldSchoolhouseImportedJson from "@/data/the-old-schoolhouse-imported.json";
import familyEducationImportedJson from "@/data/family-education-imported.json";
import beautifulFeetImportedJson from "@/data/beautiful-feet-imported.json";
import canonPressImportedJson from "@/data/canon-press-imported.json";
import bluestockingPressImportedJson from "@/data/bluestocking-press-imported.json";
import torchlightImportedJson from "@/data/torchlight-imported.json";
import civicedImportedJson from "@/data/civiced-imported.json";
import ramseySolutionsImportedJson from "@/data/ramsey-solutions-imported.json";
import geographyMattersImportedJson from "@/data/geography-matters-imported.json";
import natureStudyImportedJson from "@/data/nature-study-imported.json";
import journeyHomeschoolAcademyImportedJson from "@/data/journey-homeschool-academy-imported.json";
import outschoolElectivesImportedJson from "@/data/outschool-electives-imported.json";
import heavImportedJson from "@/data/heav-imported.json";
import collegePrepImportedJson from "@/data/college-prep-imported.json";
import memoriaPressImportedJson from "@/data/memoria-press-imported.json";
import oakMeadowImportedJson from "@/data/oak-meadow-imported.json";
import teachingTextbooksImportedJson from "@/data/teaching-textbooks-imported.json";
import veritasPressImportedJson from "@/data/veritas-press-imported.json";
import apologiaImportedJson from "@/data/apologia-imported.json";
import a2zImportedJson from "@/data/a2z-imported.json";
import bridgewayImportedJson from "@/data/bridgeway-imported.json";
import ixlImportedJson from "@/data/ixl-imported.json";
import k12ImportedJson from "@/data/k12-imported.json";
import timberdoodleImportedJson from "@/data/timberdoodle-imported.json";
import homeschoolComImportedJson from "@/data/homeschool-com-imported.json";
import iewImportedJson from "@/data/iew-imported.json";
import mysteryOfHistoryImportedJson from "@/data/mystery-of-history-imported.json";
import mathUSeeImportedJson from "@/data/math-u-see-imported.json";
import simplyCharlotteMasonImportedJson from "@/data/simply-charlotte-mason-imported.json";
import tied2TeachingImportedJson from "@/data/tied2teaching-imported.json";
import thsmImportedJson from "@/data/thsm-imported.json";
import { allAboutLearningRowToSeedInput, type AllAboutLearningCsvRow } from "@/lib/import/all-about-learning-csv";
import { amblesideOnlineRowToSeedInput, type AmblesideOnlineCsvRow } from "@/lib/import/ambleside-online-csv";
import {
  classicalConversationsRowToSeedInput,
  type ClassicalConversationsCsvRow,
} from "@/lib/import/classical-conversations-csv";
import { easyPeasyRowToSeedInput, type EasyPeasyCsvRow } from "@/lib/import/easy-peasy-csv";
import {
  homeschoolLanguagesRowToSeedInput,
  type HomeschoolLanguagesCsvRow,
} from "@/lib/import/homeschool-languages-csv";
import {
  breakingTheBarrierRowToSeedInput,
  type BreakingTheBarrierCsvRow,
} from "@/lib/import/breaking-the-barrier-csv";
import { braveWriterRowToSeedInput, type BraveWriterCsvRow } from "@/lib/import/brave-writer-csv";
import { calicoSpanishRowToSeedInput, type CalicoSpanishCsvRow } from "@/lib/import/calico-spanish-csv";
import { spellingYouSeeRowToSeedInput, type SpellingYouSeeCsvRow } from "@/lib/import/spelling-you-see-csv";
import { spellingPowerRowToSeedInput, type SpellingPowerCsvRow } from "@/lib/import/spelling-power-csv";
import {
  sequentialSpellingRowToSeedInput,
  type SequentialSpellingCsvRow,
} from "@/lib/import/sequential-spelling-csv";
import {
  essentialsInWritingRowToSeedInput,
  type EssentialsInWritingCsvRow,
} from "@/lib/import/essentials-in-writing-csv";
import { writeshopRowToSeedInput, type WriteshopCsvRow } from "@/lib/import/writeshop-csv";
import { writeathomeRowToSeedInput, type WriteathomeCsvRow } from "@/lib/import/writeathome-csv";
import {
  artisticPursuitsRowToSeedInput,
  type ArtisticPursuitsCsvRow,
} from "@/lib/import/artistic-pursuits-csv";
import {
  schoolhouseTeachersRowToSeedInput,
  type SchoolhouseTeachersCsvRow,
} from "@/lib/import/schoolhouse-teachers-csv";
import {
  freedomHomeschoolingRowToSeedInput,
  type FreedomHomeschoolingCsvRow,
} from "@/lib/import/freedom-homeschooling-csv";
import { miacademyRowToSeedInput, type MiacademyCsvRow } from "@/lib/import/miacademy-csv";
import { bjuPressRowToSeedInput, type BjuPressCsvRow } from "@/lib/import/bju-press-csv";
import { rosettaStoneRowToSeedInput, type RosettaStoneCsvRow } from "@/lib/import/rosetta-stone-csv";
import { masterbooksRowToSeedInput, type MasterbooksCsvRow } from "@/lib/import/masterbooks-csv";
import { sonlightRowToSeedInput, type SonlightCsvRow } from "@/lib/import/sonlight-csv";
import { homeSchoolRowToSeedInput, type HomeSchoolCsvRow } from "@/lib/import/home-school-csv";
import { hsldaRowToSeedInput, type HsldaCsvRow } from "@/lib/import/hslda-csv";
import {
  wellTrainedMindRowToSeedInput,
  type WellTrainedMindCsvRow,
} from "@/lib/import/well-trained-mind-csv";
import {
  homeschoolReviewsRowToSeedInput,
  type HomeschoolReviewsCsvRow,
} from "@/lib/import/homeschool-reviews-csv";
import {
  secularHomeschoolRowToSeedInput,
  type SecularHomeschoolCsvRow,
} from "@/lib/import/secular-homeschool-csv";
import {
  theOldSchoolhouseRowToSeedInput,
  type TheOldSchoolhouseCsvRow,
} from "@/lib/import/the-old-schoolhouse-csv";
import {
  familyEducationRowToSeedInput,
  type FamilyEducationCsvRow,
} from "@/lib/import/family-education-csv";
import {
  beautifulFeetRowToSeedInput,
  type BeautifulFeetCsvRow,
} from "@/lib/import/beautiful-feet-csv";
import { canonPressRowToSeedInput, type CanonPressCsvRow } from "@/lib/import/canon-press-csv";
import {
  bluestockingPressRowToSeedInput,
  type BluestockingPressCsvRow,
} from "@/lib/import/bluestocking-press-csv";
import { torchlightRowToSeedInput, type TorchlightCsvRow } from "@/lib/import/torchlight-csv";
import { civicedRowToSeedInput, type CivicedCsvRow } from "@/lib/import/civiced-csv";
import {
  ramseySolutionsRowToSeedInput,
  type RamseySolutionsCsvRow,
} from "@/lib/import/ramsey-solutions-csv";
import {
  geographyMattersRowToSeedInput,
  type GeographyMattersCsvRow,
} from "@/lib/import/geography-matters-csv";
import { natureStudyRowToSeedInput, type NatureStudyCsvRow } from "@/lib/import/nature-study-csv";
import {
  journeyHomeschoolAcademyRowToSeedInput,
  type JourneyHomeschoolAcademyCsvRow,
} from "@/lib/import/journey-homeschool-academy-csv";
import {
  outschoolElectivesRowToSeedInput,
  type OutschoolElectivesCsvRow,
} from "@/lib/import/outschool-electives-csv";
import { heavRowToSeedInput, type HeavCsvRow } from "@/lib/import/heav-csv";
import {
  collegePrepRowToSeedInput,
  type CollegePrepCsvRow,
} from "@/lib/import/college-prep-csv";
import { memoriaPressRowToSeedInput, type MemoriaPressCsvRow } from "@/lib/import/memoria-press-csv";
import { oakMeadowRowToSeedInput, type OakMeadowCsvRow } from "@/lib/import/oak-meadow-csv";
import {
  teachingTextbooksRowToSeedInput,
  type TeachingTextbooksCsvRow,
} from "@/lib/import/teaching-textbooks-csv";
import { veritasPressRowToSeedInput, type VeritasPressCsvRow } from "@/lib/import/veritas-press-csv";
import { acellusRowToSeedInput, type AcellusCsvRow } from "@/lib/import/acellus-csv";
import { apologiaRowToSeedInput, type ApologiaCsvRow } from "@/lib/import/apologia-csv";
import { bridgewayRowToSeedInput, type BridgewayCsvRow } from "@/lib/import/bridgeway-csv";
import { ixlRowToSeedInput, type IxlCsvRow } from "@/lib/import/ixl-csv";
import { k12RowToSeedInput, type K12CsvRow } from "@/lib/import/k12-csv";
import { timberdoodleRowToSeedInput, type TimberdoodleCsvRow } from "@/lib/import/timberdoodle-csv";
import { a2zRowToSeedInput, type A2zCsvRow } from "@/lib/import/a2z-csv";
import {
  homeschoolComRowToSeedInput,
  type HomeschoolComCsvRow,
} from "@/lib/import/homeschool-com-csv";
import { iewRowToSeedInput, type IewCsvRow } from "@/lib/import/iew-csv";
import { mathUSeeRowToSeedInput, type MathUSeeCsvRow } from "@/lib/import/math-u-see-csv";
import {
  mysteryOfHistoryRowToSeedInput,
  type MysteryOfHistoryCsvRow,
} from "@/lib/import/mystery-of-history-csv";
import {
  simplyCharlotteMasonRowToSeedInput,
  type SimplyCharlotteMasonCsvRow,
} from "@/lib/import/simply-charlotte-mason-csv";
import {
  tied2TeachingRowToSeedInput,
  type Tied2TeachingCsvRow,
} from "@/lib/import/tied2teaching-csv";
import {
  normalizeListingUrl,
  thsmRowToSeedInput,
  type ThsmCsvRow,
} from "@/lib/import/thsm-csv";

export type SeedInput = {
  title: string;
  listingType: ListingType;
  format: ListingFormat;
  priceType: PriceType;
  priceMin?: number | null;
  priceMax?: number | null;
  websiteUrl: string;
  city?: string | null;
  state?: string | null;
  ageMin?: number | null;
  ageMax?: number | null;
  isFeatured?: boolean;
  ratingAvg?: number;
  ratingCount?: number;
  philosophies?: string[];
  values?: string[];
  religions?: string[];
  subjects?: string[];
  description?: string;
  shortDescription?: string;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildListing(input: SeedInput, index: number): Listing {
  const slug = slugify(input.title);
  return {
    id: `seed-${index + 1}`,
    slug,
    title: input.title,
    description:
      input.description ??
      `${input.title} is a trusted homeschool resource offering ${input.listingType.replace("_", " ")} support for families. Families choose it for quality, flexibility, and alignment with their learning goals.`,
    shortDescription:
      input.shortDescription ??
      `Trusted ${input.listingType.replace("_", " ")} for homeschool families.`,
    listingType: input.listingType,
    format: input.format,
    priceType: input.priceType,
    priceMin: input.priceMin ?? null,
    priceMax: input.priceMax ?? null,
    websiteUrl: input.websiteUrl,
    city: input.city ?? null,
    state: input.state ?? null,
    country: "US",
    isVirtual: input.format !== "in_person",
    ageMin: input.ageMin ?? null,
    ageMax: input.ageMax ?? null,
    isFeatured: input.isFeatured ?? false,
    ratingAvg: input.ratingAvg ?? 4.2 + (index % 8) * 0.1,
    ratingCount: input.ratingCount ?? 20 + (index % 50),
    philosophies: input.philosophies ?? ["eclectic"],
    values: input.values ?? [],
    religions: input.religions ?? ["secular"],
    subjects: input.subjects ?? [],
    createdAt: new Date(2024, index % 12, (index % 28) + 1).toISOString(),
  };
}

const rawListings: SeedInput[] = [
  { title: "Saxon Math", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 65, priceMax: 120, websiteUrl: "https://www.hmhco.com/programs/saxon-math", philosophies: ["classical", "eclectic"], subjects: ["math"], ageMin: 5, ageMax: 18, isFeatured: true, religions: ["secular", "christian"] },
  { title: "Math-U-See", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 44, priceMax: 152, websiteUrl: "https://mathusee.com", philosophies: ["eclectic"], subjects: ["math"], values: ["parent_led"], ageMin: 4, ageMax: 18, isFeatured: true },
  { title: "Singapore Math", listingType: "curriculum", format: "online", priceType: "one_time", priceMin: 13, priceMax: 95, websiteUrl: "https://www.singaporemath.com", philosophies: ["classical"], subjects: ["math"], ageMin: 5, ageMax: 14 },
  { title: "Beast Academy", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 15, websiteUrl: "https://beastacademy.com", philosophies: ["eclectic"], subjects: ["math"], values: ["tech_friendly", "gifted"], ageMin: 8, ageMax: 13, isFeatured: true },
  { title: "Khan Academy", listingType: "online_course", format: "online", priceType: "free", websiteUrl: "https://www.khanacademy.org", philosophies: ["secular", "eclectic"], subjects: ["math", "science", "history"], values: ["self_paced", "tech_friendly"], ageMin: 5, ageMax: 18, isFeatured: true, religions: ["secular"] },
  { title: "All About Reading", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 30, priceMax: 160, websiteUrl: "https://www.allaboutlearningpress.com/all-about-reading", philosophies: ["charlotte_mason", "eclectic"], subjects: ["reading", "language_arts"], values: ["parent_led"], ageMin: 4, ageMax: 10 },
  { title: "All About Spelling", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 30, priceMax: 55, websiteUrl: "https://www.allaboutlearningpress.com/all-about-spelling", philosophies: ["charlotte_mason"], subjects: ["language_arts", "writing"], ageMin: 5, ageMax: 12 },
  { title: "Logic of English", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 85, priceMax: 175, websiteUrl: "https://www.logicofenglish.com", philosophies: ["classical"], subjects: ["reading", "language_arts"], values: ["neurodivergent_friendly"], ageMin: 4, ageMax: 12 },
  { title: "IEW Writing", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 49, priceMax: 189, websiteUrl: "https://iew.com", philosophies: ["classical"], subjects: ["writing", "language_arts"], ageMin: 8, ageMax: 18 },
  { title: "Apologia Science", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 39, priceMax: 89, websiteUrl: "https://apologia.com", philosophies: ["religious"], subjects: ["science"], religions: ["christian"], ageMin: 6, ageMax: 18, isFeatured: true },
  { title: "Real Science-4-Kids", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 35, priceMax: 75, websiteUrl: "https://www.realsecience4kids.com", philosophies: ["secular"], subjects: ["science"], religions: ["secular"], ageMin: 5, ageMax: 14 },
  { title: "Mystery Science", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 9, websiteUrl: "https://mysteryscience.com", philosophies: ["secular"], subjects: ["science"], values: ["tech_friendly"], ageMin: 5, ageMax: 12, religions: ["secular"] },
  { title: "Story of the World", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 15, priceMax: 45, websiteUrl: "https://welltrainedmind.com", philosophies: ["classical"], subjects: ["history"], ageMin: 6, ageMax: 14 },
  { title: "Beautiful Feet Books", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 50, priceMax: 200, websiteUrl: "https://www.bfbooks.com", philosophies: ["charlotte_mason"], subjects: ["history", "reading"], ageMin: 6, ageMax: 16 },
  { title: "Sonlight Curriculum", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 200, priceMax: 1200, websiteUrl: "https://www.sonlight.com", philosophies: ["charlotte_mason", "religious"], religions: ["christian"], ageMin: 4, ageMax: 18, isFeatured: true },
  { title: "BookShark", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 200, priceMax: 900, websiteUrl: "https://www.bookshark.com", philosophies: ["charlotte_mason", "secular"], religions: ["secular"], ageMin: 4, ageMax: 16 },
  { title: "Oak Meadow", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 175, priceMax: 650, websiteUrl: "https://www.oakmeadow.com", philosophies: ["waldorf", "eclectic"], values: ["parent_led"], ageMin: 4, ageMax: 18 },
  { title: "Timberdoodle", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 300, priceMax: 1100, websiteUrl: "https://timberdoodle.com", philosophies: ["eclectic"], values: ["gifted"], ageMin: 2, ageMax: 18 },
  { title: "MasterBooks", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 25, priceMax: 350, websiteUrl: "https://www.masterbooks.com", philosophies: ["religious"], religions: ["christian"], ageMin: 4, ageMax: 18 },
  { title: "Abeka", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 30, priceMax: 400, websiteUrl: "https://www.abeka.com", philosophies: ["religious", "classical"], religions: ["christian"], ageMin: 4, ageMax: 18 },
  { title: "BJU Press Homeschool", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 50, priceMax: 500, websiteUrl: "https://www.bjupresshomeschool.com", philosophies: ["religious"], religions: ["christian"], ageMin: 4, ageMax: 18 },
  { title: "Memoria Press", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 20, priceMax: 400, websiteUrl: "https://www.memoriapress.com", philosophies: ["classical"], ageMin: 4, ageMax: 18, isFeatured: true },
  { title: "Veritas Press", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 100, priceMax: 800, websiteUrl: "https://veritaspress.com", philosophies: ["classical", "religious"], religions: ["christian"], ageMin: 6, ageMax: 18 },
  { title: "Classical Conversations", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 50, websiteUrl: "https://www.classicalconversations.com", philosophies: ["classical", "religious"], religions: ["christian"], city: "Various", state: "NC", ageMin: 4, ageMax: 18, isFeatured: true },
  { title: "AmblesideOnline", listingType: "curriculum", format: "online", priceType: "free", websiteUrl: "https://amblesideonline.org", philosophies: ["charlotte_mason"], values: ["parent_led"], religions: ["christian"], ageMin: 6, ageMax: 18 },
  { title: "Simply Charlotte Mason", listingType: "curriculum", format: "online", priceType: "one_time", priceMin: 0, priceMax: 200, websiteUrl: "https://simplycharlottemason.com", philosophies: ["charlotte_mason"], ageMin: 4, ageMax: 18 },
  { title: "Wildwood Curriculum", listingType: "curriculum", format: "online", priceType: "free", websiteUrl: "https://www.wildwoodcurriculum.org", philosophies: ["charlotte_mason", "secular"], religions: ["secular"], ageMin: 6, ageMax: 12 },
  { title: "Torchlight Curriculum", listingType: "curriculum", format: "hybrid", priceType: "subscription", priceMin: 15, websiteUrl: "https://torchlightcurriculum.com", philosophies: ["secular", "eclectic"], religions: ["secular"], ageMin: 4, ageMax: 14 },
  { title: "Build Your Library", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 40, priceMax: 60, websiteUrl: "https://buildyourlibrary.com", philosophies: ["secular", "charlotte_mason"], religions: ["secular"], ageMin: 5, ageMax: 16 },
  { title: "Moving Beyond the Page", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 300, priceMax: 700, websiteUrl: "https://www.movingbeyondthepage.com", philosophies: ["unit_studies", "secular"], religions: ["secular"], ageMin: 5, ageMax: 14 },
  { title: "Brave Writer", listingType: "curriculum", format: "online", priceType: "subscription", priceMin: 15, websiteUrl: "https://bravewriter.com", philosophies: ["charlotte_mason", "unschooling"], subjects: ["writing", "language_arts"], ageMin: 5, ageMax: 18 },
  { title: "WriteShop", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 45, priceMax: 95, websiteUrl: "https://www.writeshop.com", subjects: ["writing"], ageMin: 6, ageMax: 18 },
  { title: "Teaching Textbooks", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 12, websiteUrl: "https://www.teachingtextbooks.com", subjects: ["math"], values: ["self_paced", "tech_friendly"], ageMin: 6, ageMax: 18, isFeatured: true },
  { title: "CTCMath", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 10, websiteUrl: "https://www.ctcmath.com", subjects: ["math"], values: ["self_paced"], ageMin: 4, ageMax: 18 },
  { title: "Mr. D Math", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 25, websiteUrl: "https://mrdmath.com", subjects: ["math"], ageMin: 11, ageMax: 18 },
  { title: "Art of Problem Solving", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 15, websiteUrl: "https://artofproblemsolving.com", subjects: ["math"], values: ["gifted"], ageMin: 8, ageMax: 18 },
  { title: "Outschool", listingType: "online_course", format: "online", priceType: "one_time", priceMin: 5, priceMax: 50, websiteUrl: "https://outschool.com", philosophies: ["eclectic", "secular"], values: ["tech_friendly"], ageMin: 3, ageMax: 18, isFeatured: true, religions: ["secular"] },
  { title: "Time4Learning", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 20, websiteUrl: "https://www.time4learning.com", values: ["self_paced", "tech_friendly"], ageMin: 4, ageMax: 18 },
  { title: "Power Homeschool", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 25, websiteUrl: "https://www.powerhomeschool.org", values: ["self_paced"], ageMin: 6, ageMax: 18 },
  { title: "Easy Peasy All-in-One Homeschool", listingType: "curriculum", format: "online", priceType: "free", websiteUrl: "https://allinonehomeschool.com", philosophies: ["eclectic", "religious"], religions: ["christian"], ageMin: 4, ageMax: 14 },
  { title: "Under the Home", listingType: "curriculum", format: "online", priceType: "free", websiteUrl: "https://www.underthehome.org", philosophies: ["charlotte_mason"], ageMin: 4, ageMax: 10 },
  { title: "Miacademy", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 10, websiteUrl: "https://www.parents.miacademy.co", values: ["tech_friendly", "self_paced"], ageMin: 5, ageMax: 14 },
  { title: "Night Zookeeper", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 8, websiteUrl: "https://www.nightzookeeper.com", subjects: ["writing"], values: ["tech_friendly"], ageMin: 6, ageMax: 12 },
  { title: "Duolingo", listingType: "supplement", format: "online", priceType: "free", websiteUrl: "https://www.duolingo.com", subjects: ["foreign_language"], values: ["tech_friendly", "self_paced"], ageMin: 6, ageMax: 18 },
  { title: "Rosetta Stone Homeschool", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 12, websiteUrl: "https://www.rosettastone.com", subjects: ["foreign_language"], ageMin: 6, ageMax: 18 },
  { title: "Synthesis Tutor", listingType: "tutor", format: "online", priceType: "subscription", priceMin: 20, websiteUrl: "https://www.synthesis.com", subjects: ["math", "science"], values: ["gifted", "tech_friendly"], ageMin: 6, ageMax: 14 },
  { title: "Wyzant Tutoring", listingType: "tutor", format: "hybrid", priceType: "one_time", priceMin: 35, priceMax: 80, websiteUrl: "https://www.wyzant.com", ageMin: 5, ageMax: 18 },
  { title: "Varsity Tutors", listingType: "tutor", format: "online", priceType: "one_time", priceMin: 40, priceMax: 90, websiteUrl: "https://www.varsitytutors.com", ageMin: 5, ageMax: 18 },
  { title: "Homeschool Spanish Academy", listingType: "tutor", format: "online", priceType: "subscription", priceMin: 10, websiteUrl: "https://www.spanish.academy", subjects: ["foreign_language"], ageMin: 5, ageMax: 18 },
  { title: "Homeschool Buyers Club", listingType: "supplement", format: "online", priceType: "subscription", priceMin: 0, websiteUrl: "https://www.homeschoolbuyersclub.com", philosophies: ["eclectic"], ageMin: 4, ageMax: 18 },
  { title: "Rainbow Resource Center", listingType: "supplement", format: "online", priceType: "one_time", priceMin: 5, priceMax: 500, websiteUrl: "https://www.rainbowresource.com", philosophies: ["eclectic"], ageMin: 2, ageMax: 18, isFeatured: true },
  { title: "Christianbook Homeschool", listingType: "supplement", format: "online", priceType: "one_time", priceMin: 5, priceMax: 300, websiteUrl: "https://www.christianbook.com", religions: ["christian"], ageMin: 3, ageMax: 18 },
  { title: "Secular Homeschool Curriculum Guide", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://www.secularhomeschool.com", philosophies: ["secular"], religions: ["secular"], ageMin: 4, ageMax: 18 },
  { title: "Homeschool Legal Defense Association", listingType: "support_group", format: "online", priceType: "subscription", priceMin: 12, websiteUrl: "https://hslda.org", religions: ["christian"], ageMin: 4, ageMax: 18 },
  { title: "Homeschool Mom Blog Network", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://thehomeschoolmom.com", philosophies: ["eclectic"], ageMin: 4, ageMax: 18 },
  { title: "Wild + Free", listingType: "support_group", format: "hybrid", priceType: "subscription", priceMin: 5, websiteUrl: "https://bewildandfree.org", philosophies: ["charlotte_mason", "unschooling"], values: ["screen_free"], ageMin: 3, ageMax: 14 },
  { title: "Homeschool Co-op Directory Texas", listingType: "coop", format: "in_person", priceType: "contact", websiteUrl: "https://www.thsc.org", city: "Austin", state: "TX", philosophies: ["eclectic"], ageMin: 4, ageMax: 18 },
  { title: "Austin Nature & Science Center", listingType: "field_trip", format: "in_person", priceType: "donation", websiteUrl: "https://www.austintexas.gov/department/austin-nature-science-center", city: "Austin", state: "TX", subjects: ["science"], ageMin: 4, ageMax: 16 },
  { title: "Smithsonian Learning Lab", listingType: "field_trip", format: "online", priceType: "free", websiteUrl: "https://learninglab.si.edu", subjects: ["history", "science", "art"], ageMin: 6, ageMax: 18 },
  { title: "National Gallery of Art Kids", listingType: "field_trip", format: "online", priceType: "free", websiteUrl: "https://www.nga.gov/education/kids.html", subjects: ["art"], ageMin: 5, ageMax: 14 },
  { title: "NASA STEM Engagement", listingType: "field_trip", format: "online", priceType: "free", websiteUrl: "https://www.nasa.gov/stem", subjects: ["science"], ageMin: 6, ageMax: 18 },
  { title: "Denver Museum of Nature & Science", listingType: "field_trip", format: "in_person", priceType: "one_time", priceMin: 10, priceMax: 25, websiteUrl: "https://www.dmns.org", city: "Denver", state: "CO", subjects: ["science"], ageMin: 4, ageMax: 18 },
  { title: "Georgia Aquarium Homeschool Days", listingType: "field_trip", format: "in_person", priceType: "one_time", priceMin: 15, priceMax: 35, websiteUrl: "https://www.georgiaaquarium.org", city: "Atlanta", state: "GA", subjects: ["science"], ageMin: 4, ageMax: 18 },
  { title: "Colonial Williamsburg Homeschool Days", listingType: "field_trip", format: "in_person", priceType: "one_time", priceMin: 12, priceMax: 30, websiteUrl: "https://www.colonialwilliamsburg.org", city: "Williamsburg", state: "VA", subjects: ["history"], ageMin: 6, ageMax: 18 },
  { title: "Homeschool Orchestra of Austin", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 30, websiteUrl: "https://www.example-hsoa.org", city: "Austin", state: "TX", subjects: ["music"], ageMin: 8, ageMax: 18 },
  { title: "Homeschool Sports Network", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 50, websiteUrl: "https://www.hspn.net", city: "Various", state: "TX", ageMin: 10, ageMax: 18 },
  { title: "Catholic Heritage Curricula", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 30, priceMax: 250, websiteUrl: "https://www.chcweb.com", philosophies: ["religious"], religions: ["catholic"], ageMin: 4, ageMax: 14 },
  { title: "Kolbe Academy", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 100, priceMax: 600, websiteUrl: "https://www.kolbe.org", philosophies: ["classical", "religious"], religions: ["catholic"], ageMin: 4, ageMax: 18 },
  { title: "Seton Home Study School", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 150, priceMax: 700, websiteUrl: "https://www.setonhome.org", religions: ["catholic"], ageMin: 4, ageMax: 18 },
  { title: "My Father's World", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 200, priceMax: 500, websiteUrl: "https://www.mfwbooks.com", religions: ["christian"], philosophies: ["charlotte_mason", "unit_studies"], ageMin: 4, ageMax: 14 },
  { title: "Heart of Dakota", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 50, priceMax: 300, websiteUrl: "https://heartofdakota.com", philosophies: ["charlotte_mason", "religious"], religions: ["christian"], ageMin: 4, ageMax: 16 },
  { title: "Gather 'Round Homeschool", listingType: "curriculum", format: "hybrid", priceType: "subscription", priceMin: 20, websiteUrl: "https://gatherroundhomeschool.com", philosophies: ["unit_studies", "religious"], religions: ["christian"], ageMin: 4, ageMax: 14 },
  { title: "The Good and the Beautiful", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 0, priceMax: 200, websiteUrl: "https://www.goodandbeautiful.com", philosophies: ["charlotte_mason", "religious"], religions: ["christian"], ageMin: 4, ageMax: 14, isFeatured: true },
  { title: "Life of Fred Math", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 16, priceMax: 160, websiteUrl: "https://lifeoffredmath.com", subjects: ["math"], philosophies: ["eclectic"], ageMin: 5, ageMax: 18 },
  { title: "RightStart Mathematics", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 60, priceMax: 120, websiteUrl: "https://rightstartmath.com", subjects: ["math"], values: ["parent_led"], ageMin: 4, ageMax: 12 },
  { title: "Horizons Math", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 35, priceMax: 90, websiteUrl: "https://www.aophomeschooling.com/horizons", subjects: ["math"], religions: ["christian"], ageMin: 4, ageMax: 14 },
  { title: "Prodigy Math", listingType: "supplement", format: "online", priceType: "free", websiteUrl: "https://www.prodigygame.com", subjects: ["math"], values: ["tech_friendly"], ageMin: 6, ageMax: 14 },
  { title: "IXL Learning", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 10, websiteUrl: "https://www.ixl.com", values: ["self_paced", "tech_friendly"], ageMin: 4, ageMax: 18 },
  { title: "Reading Eggs", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 10, websiteUrl: "https://readingeggs.com", subjects: ["reading"], values: ["tech_friendly"], ageMin: 2, ageMax: 10 },
  { title: "Handwriting Without Tears", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 15, priceMax: 60, websiteUrl: "https://www.lwtears.com", subjects: ["language_arts"], values: ["neurodivergent_friendly"], ageMin: 4, ageMax: 10 },
  { title: "Explode the Code", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 8, priceMax: 80, websiteUrl: "https://www.explodethecode.com", subjects: ["reading"], ageMin: 4, ageMax: 10 },
  { title: "Institute for Excellence in Writing", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 49, priceMax: 189, websiteUrl: "https://iew.com", subjects: ["writing"], philosophies: ["classical"], ageMin: 8, ageMax: 18 },
  { title: "NoRedInk", listingType: "supplement", format: "online", priceType: "free", websiteUrl: "https://www.noredink.com", subjects: ["writing", "language_arts"], values: ["tech_friendly"], ageMin: 10, ageMax: 18 },
  { title: "Crash Course", listingType: "online_course", format: "online", priceType: "free", websiteUrl: "https://thecrashcourse.com", subjects: ["history", "science"], philosophies: ["secular"], religions: ["secular"], ageMin: 10, ageMax: 18 },
  { title: "Coursera for Kids", listingType: "online_course", format: "online", priceType: "free", websiteUrl: "https://www.coursera.org", values: ["self_paced", "tech_friendly"], ageMin: 12, ageMax: 18 },
  { title: "edX", listingType: "online_course", format: "online", priceType: "free", websiteUrl: "https://www.edx.org", ageMin: 14, ageMax: 18 },
  { title: "Florida Virtual School Flex", listingType: "online_course", format: "online", priceType: "free", websiteUrl: "https://www.flvs.net", state: "FL", ageMin: 6, ageMax: 18 },
  { title: "Texas Home School Coalition", listingType: "support_group", format: "hybrid", priceType: "subscription", priceMin: 10, websiteUrl: "https://thsc.org", state: "TX", ageMin: 4, ageMax: 18 },
  { title: "California Homeschool Network", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://www.californiahomeschool.net", state: "CA", ageMin: 4, ageMax: 18 },
  { title: "New York Home Educators Network", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://www.nyhen.org", state: "NY", ageMin: 4, ageMax: 18 },
  { title: "North Carolina Homeschool-ology", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://www.nchomeschoolology.com", state: "NC", ageMin: 4, ageMax: 18 },
  { title: "Homeschool Co-op Atlanta", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 40, websiteUrl: "https://www.homeschoolcoopatlanta.com", city: "Atlanta", state: "GA", ageMin: 5, ageMax: 14 },
  { title: "Phoenix Homeschool Cooperative", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 35, websiteUrl: "https://www.phxhomeschool.org", city: "Phoenix", state: "AZ", ageMin: 5, ageMax: 16 },
  { title: "Seattle Homeschool Group", listingType: "support_group", format: "in_person", priceType: "free", websiteUrl: "https://www.seattlehomeschool.org", city: "Seattle", state: "WA", ageMin: 4, ageMax: 18 },
  { title: "Portland Homeschool Hub", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 25, websiteUrl: "https://www.pdxhomeschoolhub.org", city: "Portland", state: "OR", philosophies: ["secular"], religions: ["secular"], ageMin: 5, ageMax: 14 },
  { title: "Chicago Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 45, websiteUrl: "https://www.chicagohomeschoolcoop.org", city: "Chicago", state: "IL", ageMin: 5, ageMax: 16 },
  { title: "Boston Homeschoolers", listingType: "support_group", format: "hybrid", priceType: "free", websiteUrl: "https://www.bostonhomeschoolers.org", city: "Boston", state: "MA", ageMin: 4, ageMax: 18 },
  { title: "Miami Homeschool Association", listingType: "support_group", format: "hybrid", priceType: "free", websiteUrl: "https://www.miamihomeschool.org", city: "Miami", state: "FL", ageMin: 4, ageMax: 18 },
  { title: "Nashville Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 30, websiteUrl: "https://www.nashvillehomeschoolcoop.org", city: "Nashville", state: "TN", ageMin: 5, ageMax: 16 },
  { title: "Charlotte Homeschool Network", listingType: "support_group", format: "hybrid", priceType: "free", websiteUrl: "https://www.charlottehomeschool.net", city: "Charlotte", state: "NC", ageMin: 4, ageMax: 18 },
  { title: "Minneapolis Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 35, websiteUrl: "https://www.mplshomeschoolcoop.org", city: "Minneapolis", state: "MN", ageMin: 5, ageMax: 14 },
  { title: "Salt Lake Homeschool Group", listingType: "support_group", format: "in_person", priceType: "free", websiteUrl: "https://www.slchomeschool.org", city: "Salt Lake City", state: "UT", religions: ["christian"], ageMin: 4, ageMax: 18 },
  { title: "Albuquerque Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 25, websiteUrl: "https://www.abqhomeschoolcoop.org", city: "Albuquerque", state: "NM", ageMin: 5, ageMax: 14 },
  { title: "Montessori Homeschool Curriculum", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 50, priceMax: 300, websiteUrl: "https://www.montessorihomeschool.com", philosophies: ["montessori"], values: ["parent_led"], ageMin: 2, ageMax: 12 },
  { title: "Waldorf Essentials", listingType: "curriculum", format: "hybrid", priceType: "subscription", priceMin: 15, websiteUrl: "https://www.waldorfessentials.com", philosophies: ["waldorf"], values: ["screen_free"], ageMin: 4, ageMax: 14 },
  { title: "Oak Meadow Distance Learning", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 30, websiteUrl: "https://www.oakmeadow.com", philosophies: ["waldorf"], ageMin: 6, ageMax: 18 },
  { title: "Sustainable Homeschooling", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://www.sustainablehomeschooling.com", philosophies: ["unschooling", "eclectic"], ageMin: 4, ageMax: 18 },
  { title: "Project-Based Homeschooling", listingType: "support_group", format: "online", priceType: "one_time", priceMin: 15, websiteUrl: "https://projectbasedhomeschooling.com", philosophies: ["project_based", "unschooling"], ageMin: 4, ageMax: 14 },
  { title: "Homeschooling with Dyslexia", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://homeschoolingwithdyslexia.com", values: ["neurodivergent_friendly", "special_needs"], ageMin: 5, ageMax: 18 },
  { title: "Gifted Homeschoolers Forum", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://giftedhomeschoolers.org", values: ["gifted"], ageMin: 4, ageMax: 18 },
  { title: "Homeschooling Autism & ADHD", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://www.hslda.org", values: ["neurodivergent_friendly", "special_needs"], ageMin: 4, ageMax: 18 },
  { title: "Secular Eclectic Academic Homeschool", listingType: "support_group", format: "online", priceType: "subscription", priceMin: 8, websiteUrl: "https://seahomeschoolers.com", philosophies: ["secular", "eclectic"], religions: ["secular"], ageMin: 4, ageMax: 18 },
  { title: "Jewish Homeschool NYC", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 20, websiteUrl: "https://www.jewishhomeschoolnyc.org", city: "New York", state: "NY", religions: ["jewish"], ageMin: 5, ageMax: 14 },
  { title: "Islamic Homeschool Resources", listingType: "support_group", format: "online", priceType: "free", websiteUrl: "https://www.islamichomeschooling.net", religions: ["muslim"], ageMin: 4, ageMax: 16 },
  { title: "Art for Kids Hub", listingType: "online_course", format: "online", priceType: "free", websiteUrl: "https://www.artforkidshub.com", subjects: ["art"], values: ["tech_friendly"], ageMin: 4, ageMax: 14 },
  { title: "Deep Space Sparkle", listingType: "curriculum", format: "online", priceType: "subscription", priceMin: 12, websiteUrl: "https://www.deepspacesparkle.com", subjects: ["art"], ageMin: 5, ageMax: 12 },
  { title: "SQUILT Music Appreciation", listingType: "curriculum", format: "online", priceType: "subscription", priceMin: 8, websiteUrl: "https://squiltmusic.com", subjects: ["music"], ageMin: 4, ageMax: 14 },
  { title: "Homeschool Piano", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 15, websiteUrl: "https://www.homeschoolpiano.com", subjects: ["music"], ageMin: 6, ageMax: 18 },
  { title: "ChessKid", listingType: "supplement", format: "online", priceType: "free", websiteUrl: "https://www.chesskid.com", subjects: ["electives"], values: ["tech_friendly"], ageMin: 5, ageMax: 14 },
  { title: "KiwiCo Homeschool Crates", listingType: "supplement", format: "online", priceType: "subscription", priceMin: 20, websiteUrl: "https://www.kiwico.com", subjects: ["science", "electives"], values: ["project_based"], ageMin: 2, ageMax: 16 },
  { title: "Mel Science", listingType: "supplement", format: "hybrid", priceType: "subscription", priceMin: 30, websiteUrl: "https://melscience.com", subjects: ["science"], values: ["project_based"], ageMin: 5, ageMax: 16 },
  { title: "Home Science Tools", listingType: "supplement", format: "online", priceType: "one_time", priceMin: 10, priceMax: 200, websiteUrl: "https://www.homesciencetools.com", subjects: ["science"], ageMin: 6, ageMax: 18 },
  { title: "Homeschool Planet Planner", listingType: "supplement", format: "online", priceType: "subscription", priceMin: 7, websiteUrl: "https://www.homeschoolplanet.com", values: ["parent_led"], ageMin: 4, ageMax: 18 },
  { title: "Trello for Homeschool Planning", listingType: "supplement", format: "online", priceType: "free", websiteUrl: "https://trello.com", values: ["parent_led"], ageMin: 4, ageMax: 18 },
  { title: "Notion Homeschool Templates", listingType: "supplement", format: "online", priceType: "free", websiteUrl: "https://www.notion.so", values: ["parent_led"], ageMin: 4, ageMax: 18 },
  { title: "Brave Homeschool Planner", listingType: "supplement", format: "online", priceType: "one_time", priceMin: 20, websiteUrl: "https://bravehomeschoolplanner.com", ageMin: 4, ageMax: 18 },
  { title: "Homeschool Tracker", listingType: "supplement", format: "online", priceType: "subscription", priceMin: 5, websiteUrl: "https://www.homeschooltracker.com", ageMin: 4, ageMax: 18 },
  { title: "Scholé Academy", listingType: "online_course", format: "online", priceType: "one_time", priceMin: 200, priceMax: 600, websiteUrl: "https://scholeacademy.com", philosophies: ["classical"], ageMin: 10, ageMax: 18 },
  { title: "Wilson Hill Academy", listingType: "online_course", format: "online", priceType: "one_time", priceMin: 300, priceMax: 800, websiteUrl: "https://wilsonhillacademy.com", philosophies: ["classical"], ageMin: 12, ageMax: 18 },
  { title: "Kepler Education", listingType: "online_course", format: "online", priceType: "one_time", priceMin: 250, priceMax: 700, websiteUrl: "https://kepler.education", philosophies: ["classical"], ageMin: 12, ageMax: 18 },
  { title: "Homeschool Connections", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 15, websiteUrl: "https://homeschoolconnections.com", religions: ["catholic"], ageMin: 10, ageMax: 18 },
  { title: "Catholic Schoolhouse", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 40, websiteUrl: "https://catholicschoolhouse.com", religions: ["catholic"], philosophies: ["classical"], city: "Various", state: "VA", ageMin: 4, ageMax: 16 },
  { title: "Classical Academic Press", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 20, priceMax: 150, websiteUrl: "https://classicalacademicpress.com", philosophies: ["classical"], ageMin: 6, ageMax: 18 },
  { title: "Well-Trained Mind Academy", listingType: "online_course", format: "online", priceType: "one_time", priceMin: 300, priceMax: 700, websiteUrl: "https://welltrainedmind.com/academy", philosophies: ["classical"], ageMin: 10, ageMax: 18 },
  { title: "Discovery K12", listingType: "online_course", format: "online", priceType: "free", websiteUrl: "https://discoveryk12.com", ageMin: 4, ageMax: 18 },
  { title: "MobyMax", listingType: "online_course", format: "online", priceType: "subscription", priceMin: 7, websiteUrl: "https://www.mobymax.com", values: ["special_needs", "self_paced"], ageMin: 4, ageMax: 14 },
  { title: "Essentials in Writing", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 40, priceMax: 90, websiteUrl: "https://essentialsinwriting.com", subjects: ["writing"], ageMin: 6, ageMax: 18 },
  { title: "Spelling You See", listingType: "curriculum", format: "hybrid", priceType: "one_time", priceMin: 30, priceMax: 55, websiteUrl: "https://spellingyousee.com", subjects: ["language_arts"], ageMin: 5, ageMax: 12 },
  { title: "Pinellas Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 30, websiteUrl: "https://www.pinellashomeschool.org", city: "Clearwater", state: "FL", ageMin: 5, ageMax: 14 },
  { title: "San Diego Homeschool Center", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 40, websiteUrl: "https://www.sdhomeschoolcenter.org", city: "San Diego", state: "CA", ageMin: 5, ageMax: 16 },
  { title: "Las Vegas Homeschool Group", listingType: "support_group", format: "hybrid", priceType: "free", websiteUrl: "https://www.lvhomeschool.org", city: "Las Vegas", state: "NV", ageMin: 4, ageMax: 18 },
  { title: "Kansas City Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 30, websiteUrl: "https://www.kchomeschoolcoop.org", city: "Kansas City", state: "MO", ageMin: 5, ageMax: 14 },
  { title: "Columbus Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 35, websiteUrl: "https://www.columbushomeschool.org", city: "Columbus", state: "OH", ageMin: 5, ageMax: 16 },
  { title: "Detroit Area Homeschoolers", listingType: "support_group", format: "hybrid", priceType: "free", websiteUrl: "https://www.detroithomeschool.org", city: "Detroit", state: "MI", ageMin: 4, ageMax: 18 },
  { title: "Philadelphia Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 40, websiteUrl: "https://www.phillyhomeschoolcoop.org", city: "Philadelphia", state: "PA", ageMin: 5, ageMax: 14 },
  { title: "Houston Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 35, websiteUrl: "https://www.houstonhomeschoolcoop.org", city: "Houston", state: "TX", ageMin: 5, ageMax: 16 },
  { title: "Dallas Homeschool Resource Center", listingType: "support_group", format: "in_person", priceType: "free", websiteUrl: "https://www.dallashomeschool.org", city: "Dallas", state: "TX", ageMin: 4, ageMax: 18 },
  { title: "Raleigh Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 30, websiteUrl: "https://www.raleighhomeschoolcoop.org", city: "Raleigh", state: "NC", ageMin: 5, ageMax: 14 },
  { title: "Richmond Homeschool Collective", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 25, websiteUrl: "https://www.richmondhomeschool.org", city: "Richmond", state: "VA", ageMin: 5, ageMax: 14 },
  { title: "Boise Homeschool Co-op", listingType: "coop", format: "in_person", priceType: "subscription", priceMin: 25, websiteUrl: "https://www.boisehomeschoolcoop.org", city: "Boise", state: "ID", ageMin: 5, ageMax: 14 },
  { title: "Anchorage Homeschool Group", listingType: "support_group", format: "hybrid", priceType: "free", websiteUrl: "https://www.anchoragehomeschool.org", city: "Anchorage", state: "AK", ageMin: 4, ageMax: 18 },
  { title: "Honolulu Homeschool Ohana", listingType: "support_group", format: "in_person", priceType: "free", websiteUrl: "https://www.honoluluhomeschool.org", city: "Honolulu", state: "HI", ageMin: 4, ageMax: 18 },
];

const thsmImported: SeedInput[] = (thsmImportedJson as ThsmCsvRow[]).map(thsmRowToSeedInput);
const homeschoolComImported: SeedInput[] = (homeschoolComImportedJson as HomeschoolComCsvRow[]).map(
  homeschoolComRowToSeedInput,
);
const a2zImported: SeedInput[] = (a2zImportedJson as A2zCsvRow[]).map(a2zRowToSeedInput);
const mathUSeeImported: SeedInput[] = (mathUSeeImportedJson as MathUSeeCsvRow[]).map(
  mathUSeeRowToSeedInput,
);
const apologiaImported: SeedInput[] = (apologiaImportedJson as ApologiaCsvRow[]).map(
  apologiaRowToSeedInput,
);
const tied2TeachingImported: SeedInput[] = (tied2TeachingImportedJson as Tied2TeachingCsvRow[]).map(
  tied2TeachingRowToSeedInput,
);
const mysteryOfHistoryImported: SeedInput[] = (
  mysteryOfHistoryImportedJson as MysteryOfHistoryCsvRow[]
).map(mysteryOfHistoryRowToSeedInput);
const simplyCharlotteMasonImported: SeedInput[] = (
  simplyCharlotteMasonImportedJson as SimplyCharlotteMasonCsvRow[]
).map(simplyCharlotteMasonRowToSeedInput);
const iewImported: SeedInput[] = (iewImportedJson as IewCsvRow[]).map(iewRowToSeedInput);
const k12Imported: SeedInput[] = (k12ImportedJson as K12CsvRow[]).map(k12RowToSeedInput);
const acellusImported: SeedInput[] = (acellusImportedJson as AcellusCsvRow[]).map(
  acellusRowToSeedInput,
);
const ixlImported: SeedInput[] = (ixlImportedJson as IxlCsvRow[]).map(ixlRowToSeedInput);
const timberdoodleImported: SeedInput[] = (timberdoodleImportedJson as TimberdoodleCsvRow[]).map(
  timberdoodleRowToSeedInput,
);
const bridgewayImported: SeedInput[] = (bridgewayImportedJson as BridgewayCsvRow[]).map(
  bridgewayRowToSeedInput,
);
const classicalConversationsImported: SeedInput[] = (
  classicalConversationsImportedJson as ClassicalConversationsCsvRow[]
).map(classicalConversationsRowToSeedInput);
const memoriaPressImported: SeedInput[] = (memoriaPressImportedJson as MemoriaPressCsvRow[]).map(
  memoriaPressRowToSeedInput,
);
const veritasPressImported: SeedInput[] = (veritasPressImportedJson as VeritasPressCsvRow[]).map(
  veritasPressRowToSeedInput,
);
const oakMeadowImported: SeedInput[] = (oakMeadowImportedJson as OakMeadowCsvRow[]).map(
  oakMeadowRowToSeedInput,
);
const amblesideOnlineImported: SeedInput[] = (
  amblesideOnlineImportedJson as AmblesideOnlineCsvRow[]
).map(amblesideOnlineRowToSeedInput);
const allAboutLearningImported: SeedInput[] = (
  allAboutLearningImportedJson as AllAboutLearningCsvRow[]
).map(allAboutLearningRowToSeedInput);
const teachingTextbooksImported: SeedInput[] = (
  teachingTextbooksImportedJson as TeachingTextbooksCsvRow[]
).map(teachingTextbooksRowToSeedInput);
const easyPeasyImported: SeedInput[] = (easyPeasyImportedJson as EasyPeasyCsvRow[]).map(
  easyPeasyRowToSeedInput,
);
const homeschoolLanguagesImported: SeedInput[] = (
  homeschoolLanguagesImportedJson as HomeschoolLanguagesCsvRow[]
).map(homeschoolLanguagesRowToSeedInput);
const breakingTheBarrierImported: SeedInput[] = (
  breakingTheBarrierImportedJson as BreakingTheBarrierCsvRow[]
).map(breakingTheBarrierRowToSeedInput);
const braveWriterImported: SeedInput[] = (braveWriterImportedJson as BraveWriterCsvRow[]).map(
  braveWriterRowToSeedInput,
);
const calicoSpanishImported: SeedInput[] = (calicoSpanishImportedJson as CalicoSpanishCsvRow[]).map(
  calicoSpanishRowToSeedInput,
);
const spellingYouSeeImported: SeedInput[] = (
  spellingYouSeeImportedJson as SpellingYouSeeCsvRow[]
).map(spellingYouSeeRowToSeedInput);
const spellingPowerImported: SeedInput[] = (spellingPowerImportedJson as SpellingPowerCsvRow[]).map(
  spellingPowerRowToSeedInput,
);
const sequentialSpellingImported: SeedInput[] = (
  sequentialSpellingImportedJson as SequentialSpellingCsvRow[]
).map(sequentialSpellingRowToSeedInput);
const essentialsInWritingImported: SeedInput[] = (
  essentialsInWritingImportedJson as EssentialsInWritingCsvRow[]
).map(essentialsInWritingRowToSeedInput);
const writeshopImported: SeedInput[] = (writeshopImportedJson as WriteshopCsvRow[]).map(
  writeshopRowToSeedInput,
);
const writeathomeImported: SeedInput[] = (writeathomeImportedJson as WriteathomeCsvRow[]).map(
  writeathomeRowToSeedInput,
);
const artisticPursuitsImported: SeedInput[] = (
  artisticPursuitsImportedJson as ArtisticPursuitsCsvRow[]
).map(artisticPursuitsRowToSeedInput);
const schoolhouseTeachersImported: SeedInput[] = (
  schoolhouseTeachersImportedJson as SchoolhouseTeachersCsvRow[]
).map(schoolhouseTeachersRowToSeedInput);
const freedomHomeschoolingImported: SeedInput[] = (
  freedomHomeschoolingImportedJson as FreedomHomeschoolingCsvRow[]
).map(freedomHomeschoolingRowToSeedInput);
const miacademyImported: SeedInput[] = (miacademyImportedJson as MiacademyCsvRow[]).map(
  miacademyRowToSeedInput,
);
const bjuPressImported: SeedInput[] = (bjuPressImportedJson as BjuPressCsvRow[]).map(
  bjuPressRowToSeedInput,
);
const rosettaStoneImported: SeedInput[] = (rosettaStoneImportedJson as RosettaStoneCsvRow[]).map(
  rosettaStoneRowToSeedInput,
);
const masterbooksImported: SeedInput[] = (masterbooksImportedJson as MasterbooksCsvRow[]).map(
  masterbooksRowToSeedInput,
);
const sonlightImported: SeedInput[] = (sonlightImportedJson as SonlightCsvRow[]).map(
  sonlightRowToSeedInput,
);
const homeSchoolImported: SeedInput[] = (homeSchoolImportedJson as HomeSchoolCsvRow[]).map(
  homeSchoolRowToSeedInput,
);
const hsldaImported: SeedInput[] = (hsldaImportedJson as HsldaCsvRow[]).map(hsldaRowToSeedInput);
const wellTrainedMindImported: SeedInput[] = (
  wellTrainedMindImportedJson as WellTrainedMindCsvRow[]
).map(wellTrainedMindRowToSeedInput);
const homeschoolReviewsImported: SeedInput[] = (
  homeschoolReviewsImportedJson as HomeschoolReviewsCsvRow[]
).map(homeschoolReviewsRowToSeedInput);
const secularHomeschoolImported: SeedInput[] = (
  secularHomeschoolImportedJson as SecularHomeschoolCsvRow[]
).map(secularHomeschoolRowToSeedInput);
const theOldSchoolhouseImported: SeedInput[] = (
  theOldSchoolhouseImportedJson as TheOldSchoolhouseCsvRow[]
).map(theOldSchoolhouseRowToSeedInput);
const familyEducationImported: SeedInput[] = (
  familyEducationImportedJson as FamilyEducationCsvRow[]
).map(familyEducationRowToSeedInput);
const beautifulFeetImported: SeedInput[] = (
  beautifulFeetImportedJson as BeautifulFeetCsvRow[]
).map(beautifulFeetRowToSeedInput);
const canonPressImported: SeedInput[] = (canonPressImportedJson as CanonPressCsvRow[]).map(
  canonPressRowToSeedInput,
);
const bluestockingPressImported: SeedInput[] = (
  bluestockingPressImportedJson as BluestockingPressCsvRow[]
).map(bluestockingPressRowToSeedInput);
const torchlightImported: SeedInput[] = (torchlightImportedJson as TorchlightCsvRow[]).map(
  torchlightRowToSeedInput,
);
const civicedImported: SeedInput[] = (civicedImportedJson as CivicedCsvRow[]).map(
  civicedRowToSeedInput,
);
const ramseySolutionsImported: SeedInput[] = (
  ramseySolutionsImportedJson as RamseySolutionsCsvRow[]
).map(ramseySolutionsRowToSeedInput);
const geographyMattersImported: SeedInput[] = (
  geographyMattersImportedJson as GeographyMattersCsvRow[]
).map(geographyMattersRowToSeedInput);
const natureStudyImported: SeedInput[] = (natureStudyImportedJson as NatureStudyCsvRow[]).map(
  natureStudyRowToSeedInput,
);
const journeyHomeschoolAcademyImported: SeedInput[] = (
  journeyHomeschoolAcademyImportedJson as JourneyHomeschoolAcademyCsvRow[]
).map(journeyHomeschoolAcademyRowToSeedInput);
const outschoolElectivesImported: SeedInput[] = (
  outschoolElectivesImportedJson as OutschoolElectivesCsvRow[]
).map(outschoolElectivesRowToSeedInput);
const heavImported: SeedInput[] = (heavImportedJson as HeavCsvRow[]).map(heavRowToSeedInput);
const collegePrepImported: SeedInput[] = (collegePrepImportedJson as CollegePrepCsvRow[]).map(
  collegePrepRowToSeedInput,
);

function mergeSeedInputs(base: SeedInput[], imported: SeedInput[]) {
  const byUrl = new Map<string, number>();
  const merged = base.map((item) => ({ ...item }));

  merged.forEach((item, index) => {
    byUrl.set(normalizeListingUrl(item.websiteUrl), index);
  });

  for (const item of imported) {
    const urlKey = normalizeListingUrl(item.websiteUrl);
    const existingIndex = byUrl.get(urlKey);

    if (existingIndex != null) {
      const existing = merged[existingIndex];
      if (
        item.description &&
        !existing.description?.includes("thehomeschoolmom.com") &&
        !existing.description?.includes("homeschool.com/resource-guide") &&
        !existing.description?.includes("A2Z Homeschooling archive") &&
        !existing.description?.includes("Apologia product:") &&
        !existing.description?.includes("Tied 2 Teaching resource:") &&
        !existing.description?.includes("The Mystery of History product:") &&
        !existing.description?.includes("Simply Charlotte Mason product:") &&
        !existing.description?.includes("IEW product:") &&
        !existing.description?.includes("K12 (Stride) product:") &&
        !existing.description?.includes("Power Homeschool / Acellus resource:") &&
        !existing.description?.includes("IXL resource:") &&
        !existing.description?.includes("Timberdoodle product:") &&
        !existing.description?.includes("Bridgeway Academy resource:") &&
        !existing.description?.includes("Classical Conversations resource:") &&
        !existing.description?.includes("Memoria Press product:") &&
        !existing.description?.includes("Veritas Press resource:") &&
        !existing.description?.includes("Oak Meadow resource:") &&
        !existing.description?.includes("AmblesideOnline resource:") &&
        !existing.description?.includes("All About Learning Press product:") &&
        !existing.description?.includes("Teaching Textbooks resource:") &&
        !existing.description?.includes("Easy Peasy All-in-One resource:") &&
        !existing.description?.includes("Homeschool Languages resource:") &&
        !existing.description?.includes("Breaking the Barrier resource:") &&
        !existing.description?.includes("Brave Writer resource:") &&
        !existing.description?.includes("Calico Spanish resource:") &&
        !existing.description?.includes("Spelling You See resource:") &&
        !existing.description?.includes("Spelling Power resource:") &&
        !existing.description?.includes("Sequential Spelling resource:") &&
        !existing.description?.includes("Essentials in Writing resource:") &&
        !existing.description?.includes("WriteShop resource:") &&
        !existing.description?.includes("WriteAtHome resource:") &&
        !existing.description?.includes("ARTistic Pursuits resource:") &&
        !existing.description?.includes("Schoolhouse Teachers resource:") &&
        !existing.description?.includes("Freedom Homeschooling resource:") &&
        !existing.description?.includes("Miacademy resource:") &&
        !existing.description?.includes("BJU Press Homeschool resource:") &&
        !existing.description?.includes("Rosetta Stone resource:") &&
        !existing.description?.includes("Master Books resource:") &&
        !existing.description?.includes("Sonlight resource:") &&
        !existing.description?.includes("Homeschool World resource:") &&
        !existing.description?.includes("HSLDA resource:") &&
        !existing.description?.includes("Well-Trained Mind resource:") &&
        !existing.description?.includes("HomeschoolReviews.com resource:") &&
        !existing.description?.includes("Secular Homeschool resource:") &&
        !existing.description?.includes("The Old Schoolhouse Store resource:") &&
        !existing.description?.includes("FamilyEducation resource:") &&
        !existing.description?.includes("Beautiful Feet Books resource:") &&
        !existing.description?.includes("Canon Press resource:") &&
        !existing.description?.includes("Bluestocking Press resource:") &&
        !existing.description?.includes("Torchlight Curriculum resource:") &&
        !existing.description?.includes("Center for Civic Education resource:") &&
        !existing.description?.includes("Ramsey Solutions resource:") &&
        !existing.description?.includes("Geography Matters resource:") &&
        !existing.description?.includes("Nature Study Resources resource:") &&
        !existing.description?.includes("Journey Homeschool Academy resource:") &&
        !existing.description?.includes("Outschool resource:") &&
        !existing.description?.includes("HEAV resource:") &&
        !existing.description?.includes("College Prep resource:")
      ) {
        existing.description = [existing.description, item.description].filter(Boolean).join(" ");
      }
      if (item.priceMin != null && existing.priceMin == null) existing.priceMin = item.priceMin;
      if (item.priceMax != null && existing.priceMax == null) existing.priceMax = item.priceMax;
      if (item.ageMin != null && existing.ageMin == null) existing.ageMin = item.ageMin;
      if (item.ageMax != null && existing.ageMax == null) existing.ageMax = item.ageMax;
      continue;
    }

    merged.push(item);
    byUrl.set(urlKey, merged.length - 1);
  }

  return merged;
}

const batch4Imported = mergeSeedInputs(
  mergeSeedInputs(
    mergeSeedInputs(
      mergeSeedInputs(homeschoolLanguagesImported, breakingTheBarrierImported),
      mergeSeedInputs(braveWriterImported, calicoSpanishImported),
    ),
    mergeSeedInputs(
      mergeSeedInputs(spellingYouSeeImported, spellingPowerImported),
      mergeSeedInputs(
        sequentialSpellingImported,
        mergeSeedInputs(essentialsInWritingImported, writeshopImported),
      ),
    ),
  ),
  mergeSeedInputs(
    mergeSeedInputs(
      mergeSeedInputs(writeathomeImported, artisticPursuitsImported),
      mergeSeedInputs(schoolhouseTeachersImported, freedomHomeschoolingImported),
    ),
    mergeSeedInputs(
      mergeSeedInputs(miacademyImported, bjuPressImported),
      mergeSeedInputs(rosettaStoneImported, mergeSeedInputs(masterbooksImported, sonlightImported)),
    ),
  ),
);

const priorImported = mergeSeedInputs(
  mergeSeedInputs(
    mergeSeedInputs(
      mergeSeedInputs(
        mergeSeedInputs(
          mergeSeedInputs(
            mergeSeedInputs(
              mergeSeedInputs(mergeSeedInputs(rawListings, thsmImported), homeschoolComImported),
              a2zImported,
            ),
            mathUSeeImported,
          ),
          apologiaImported,
        ),
        tied2TeachingImported,
      ),
      mysteryOfHistoryImported,
    ),
    simplyCharlotteMasonImported,
  ),
  mergeSeedInputs(
    mergeSeedInputs(
      iewImported,
      mergeSeedInputs(
        mergeSeedInputs(k12Imported, acellusImported),
        mergeSeedInputs(ixlImported, timberdoodleImported),
      ),
    ),
    mergeSeedInputs(
      bridgewayImported,
      mergeSeedInputs(
        mergeSeedInputs(
          mergeSeedInputs(classicalConversationsImported, memoriaPressImported),
          mergeSeedInputs(veritasPressImported, oakMeadowImported),
        ),
        mergeSeedInputs(
          mergeSeedInputs(amblesideOnlineImported, allAboutLearningImported),
          mergeSeedInputs(teachingTextbooksImported, easyPeasyImported),
        ),
      ),
    ),
  ),
);

const batch5Imported = mergeSeedInputs(
  mergeSeedInputs(
    mergeSeedInputs(homeSchoolImported, hsldaImported),
    mergeSeedInputs(wellTrainedMindImported, homeschoolReviewsImported),
  ),
  mergeSeedInputs(
    mergeSeedInputs(secularHomeschoolImported, theOldSchoolhouseImported),
    familyEducationImported,
  ),
);

const batch6Imported = mergeSeedInputs(
  mergeSeedInputs(
    mergeSeedInputs(beautifulFeetImported, canonPressImported),
    mergeSeedInputs(bluestockingPressImported, torchlightImported),
  ),
  mergeSeedInputs(
    mergeSeedInputs(
      mergeSeedInputs(civicedImported, ramseySolutionsImported),
      mergeSeedInputs(geographyMattersImported, natureStudyImported),
    ),
    mergeSeedInputs(journeyHomeschoolAcademyImported, outschoolElectivesImported),
  ),
);

const batch7Imported = mergeSeedInputs(heavImported, collegePrepImported);

const allListings = mergeSeedInputs(
  mergeSeedInputs(mergeSeedInputs(priorImported, batch4Imported), batch5Imported),
  mergeSeedInputs(batch6Imported, batch7Imported),
);

export const seedListings: Listing[] = allListings.map((listing, index) => buildListing(listing, index));

export function getListingBySlug(slug: string) {
  return seedListings.find((listing) => listing.slug === slug) ?? null;
}

export function getFeaturedListings(limit = 6) {
  return seedListings.filter((listing) => listing.isFeatured).slice(0, limit);
}
