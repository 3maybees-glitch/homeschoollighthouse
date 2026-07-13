import type { SocialMediaChannel, SocialPlatform } from "@/types/social-media";

export const socialPlatformOptions: {
  value: SocialPlatform;
  label: string;
  description: string;
}[] = [
  {
    value: "youtube",
    label: "YouTube",
    description: "Video lessons, curriculum walkthroughs, and homeschool day-in-the-life inspiration.",
  },
  {
    value: "facebook",
    label: "Facebook",
    description: "Groups and pages for community support, curriculum swaps, and local connections.",
  },
  {
    value: "instagram",
    label: "Instagram",
    description: "Visual inspiration, planning ideas, and relatable homeschool family content.",
  },
  {
    value: "tiktok",
    label: "TikTok",
    description: "Quick tips, curriculum reviews, and honest homeschool humor in short form.",
  },
  {
    value: "pinterest",
    label: "Pinterest",
    description: "Printables, unit-study boards, and hands-on learning activity collections.",
  },
  {
    value: "x",
    label: "X",
    description: "News, policy updates, and real-time conversation from homeschool leaders.",
  },
];

export const homeschoolSocialChannels: SocialMediaChannel[] = [
  // YouTube — top 10 homeschool-focused channels
  {
    id: "yt-homeschool-pop",
    name: "Homeschool Pop",
    handle: "@HomeschoolPop",
    url: "https://www.youtube.com/@HomeschoolPop",
    platform: "youtube",
    description:
      "Animated lessons and educational videos covering history, science, and geography for elementary learners.",
  },
  {
    id: "yt-good-beautiful",
    name: "The Good and the Beautiful",
    handle: "@TheGoodandtheBeautiful",
    url: "https://www.youtube.com/@TheGoodandtheBeautiful",
    platform: "youtube",
    description:
      "Faith-based curriculum publisher sharing book previews, teaching tips, and family learning encouragement.",
  },
  {
    id: "yt-socratica",
    name: "Socratica",
    handle: "@socratica",
    url: "https://www.youtube.com/@socratica",
    platform: "youtube",
    description:
      "Concise science, math, and humanities explainers trusted by homeschool families for supplementing core subjects.",
  },
  {
    id: "yt-math-antics",
    name: "Math Antics",
    handle: "@mathantics",
    url: "https://www.youtube.com/@mathantics",
    platform: "youtube",
    description:
      "Clear, visual math instruction from arithmetic through algebra — a staple for homeschool math support.",
  },
  {
    id: "yt-crash-course",
    name: "Crash Course",
    handle: "@crashcourse",
    url: "https://www.youtube.com/@crashcourse",
    platform: "youtube",
    description:
      "Fast-paced courses in history, science, literature, and government widely used as a homeschool supplement.",
  },
  {
    id: "yt-brave-writer",
    name: "Brave Writer",
    handle: "@BraveWriter",
    url: "https://www.youtube.com/@BraveWriter",
    platform: "youtube",
    description:
      "Julie Bogart's writing and language arts philosophy — workshops, book talks, and nurturing the writer in every child.",
  },
  {
    id: "yt-pam-barnhill",
    name: "Pam Barnhill",
    handle: "@PamBarnhill",
    url: "https://www.youtube.com/@PamBarnhill",
    platform: "youtube",
    description:
      "Morning baskets, loop scheduling, and practical planning systems for organized, joyful homeschool days.",
  },
  {
    id: "yt-erica-arndt",
    name: "Erica Arndt",
    handle: "@EricaArndt",
    url: "https://www.youtube.com/@EricaArndt",
    platform: "youtube",
    description:
      "Curriculum hauls, homeschool room tours, and honest reviews from a longtime homeschooling mom of four.",
  },
  {
    id: "yt-abeka",
    name: "Abeka Homeschool",
    handle: "@AbekaHomeschool",
    url: "https://www.youtube.com/@AbekaHomeschool",
    platform: "youtube",
    description:
      "Christian publisher channel with curriculum overviews, teaching demonstrations, and parent support resources.",
  },
  {
    id: "yt-hip-homeschool",
    name: "Hip Homeschool Moms",
    handle: "@HipHomeschoolMoms",
    url: "https://www.youtube.com/@HipHomeschoolMoms",
    platform: "youtube",
    description:
      "Community-driven channel featuring interviews, curriculum spotlights, and encouragement for homeschool parents.",
  },

  // Facebook — top 10 homeschool groups and pages
  {
    id: "fb-secular-families",
    name: "Secular Homeschool Families",
    handle: "Facebook Group",
    url: "https://www.facebook.com/groups/secularhomeschoolfamilies",
    platform: "facebook",
    description:
      "Large secular community for curriculum recommendations, resource sharing, and non-religious homeschool support.",
  },
  {
    id: "fb-wild-free",
    name: "Wild + Free Community",
    handle: "Facebook Group",
    url: "https://www.facebook.com/groups/wildandfreecommunity",
    platform: "facebook",
    description:
      "Charlotte Mason–inspired group focused on nature study, outdoor learning, and preserving childhood wonder.",
  },
  {
    id: "fb-hip-moms",
    name: "Hip Homeschool Moms",
    handle: "@HipHomeschoolMoms",
    url: "https://www.facebook.com/HipHomeschoolMoms",
    platform: "facebook",
    description:
      "One of the largest homeschool Facebook pages — articles, giveaways, and a welcoming parent community.",
  },
  {
    id: "fb-mom-support",
    name: "Homeschool Mom Support Group",
    handle: "Facebook Group",
    url: "https://www.facebook.com/groups/homeschoolmomsupport",
    platform: "facebook",
    description:
      "Peer support for homeschooling mothers — venting, advice, encouragement, and practical day-to-day help.",
  },
  {
    id: "fb-old-schoolhouse",
    name: "The Old Schoolhouse",
    handle: "@TheOldSchoolhouse",
    url: "https://www.facebook.com/TheOldSchoolhouse",
    platform: "facebook",
    description:
      "Magazine and media brand sharing homeschool news, curriculum reviews, and conference updates.",
  },
  {
    id: "fb-hslda",
    name: "HSLDA",
    handle: "@HSLDA",
    url: "https://www.facebook.com/HSLDA",
    platform: "facebook",
    description:
      "Home School Legal Defense Association — legal updates, state law guidance, and homeschool advocacy news.",
  },
  {
    id: "fb-charlotte-mason",
    name: "Charlotte Mason Living",
    handle: "Facebook Group",
    url: "https://www.facebook.com/groups/CharlotteMasonLiving",
    platform: "facebook",
    description:
      "Active group for living books, narration, nature journals, and Charlotte Mason method discussion.",
  },
  {
    id: "fb-simple-homeschool",
    name: "Simple Homeschool",
    handle: "@SimpleHomeschool",
    url: "https://www.facebook.com/SimpleHomeschool",
    platform: "facebook",
    description:
      "Jamie Martin's community promoting simplified, intentional homeschooling without overwhelm.",
  },
  {
    id: "fb-curriculum-review",
    name: "Homeschool Curriculum Review",
    handle: "Facebook Group",
    url: "https://www.facebook.com/groups/homeschoolcurriculumreview",
    platform: "facebook",
    description:
      "Parents share honest curriculum reviews, comparisons, and recommendations before you buy.",
  },
  {
    id: "fb-raising-lifelong",
    name: "Raising Lifelong Learners",
    handle: "@RaisingLifelongLearners",
    url: "https://www.facebook.com/RaisingLifelongLearners",
    platform: "facebook",
    description:
      "Colleen Kessler's page for gifted and twice-exceptional learners — resources, tips, and community.",
  },

  // Instagram — top 10 homeschool accounts
  {
    id: "ig-brave-writer",
    name: "Brave Writer",
    handle: "@bravelwriter",
    url: "https://www.instagram.com/bravelwriter/",
    platform: "instagram",
    description:
      "Poetry teas, writing prompts, and gentle language arts inspiration for everyday homeschool life.",
  },
  {
    id: "ig-timberdoodle",
    name: "Timberdoodle",
    handle: "@timberdoodle",
    url: "https://www.instagram.com/timberdoodle/",
    platform: "instagram",
    description:
      "Hands-on curriculum kits, STEM favorites, and creative learning product spotlights for all ages.",
  },
  {
    id: "ig-good-beautiful",
    name: "The Good and the Beautiful",
    handle: "@thegoodandthebeautiful",
    url: "https://www.instagram.com/thegoodandthebeautiful/",
    platform: "instagram",
    description:
      "Beautiful curriculum visuals, free resource announcements, and family learning moments.",
  },
  {
    id: "ig-simple-homeschool",
    name: "Simple Homeschool",
    handle: "@simplehomeschool",
    url: "https://www.instagram.com/simplehomeschool/",
    platform: "instagram",
    description:
      "Calm, intentional homeschool aesthetics — planning inspiration without the pressure to do it all.",
  },
  {
    id: "ig-jady-a",
    name: "Jady A",
    handle: "@jady.a",
    url: "https://www.instagram.com/jady.a/",
    platform: "instagram",
    description:
      "Large-family homeschool routines, curriculum choices, and relatable mom-life content.",
  },
  {
    id: "ig-raising-lifelong",
    name: "Raising Lifelong Learners",
    handle: "@raisinglifelonglearners",
    url: "https://www.instagram.com/raisinglifelonglearners/",
    platform: "instagram",
    description:
      "Gifted education strategies, project-based learning ideas, and support for out-of-the-box learners.",
  },
  {
    id: "ig-pam-barnhill",
    name: "Pam Barnhill",
    handle: "@pambarnhill",
    url: "https://www.instagram.com/pambarnhill/",
    platform: "instagram",
    description:
      "Morning basket setups, planning printables, and homeschool organization tips in visual form.",
  },
  {
    id: "ig-scm",
    name: "Simply Charlotte Mason",
    handle: "@simplycharlottemason",
    url: "https://www.instagram.com/simplycharlottemason/",
    platform: "instagram",
    description:
      "Charlotte Mason curriculum publisher sharing living-book lists, habit training, and nature study.",
  },
  {
    id: "ig-homeschool-scientist",
    name: "The Homeschool Scientist",
    handle: "@thehomeschoolscientist",
    url: "https://www.instagram.com/thehomeschoolscientist/",
    platform: "instagram",
    description:
      "Science experiments, STEM project ideas, and lab resources designed for home educators.",
  },
  {
    id: "ig-wild-free",
    name: "Wild + Free",
    handle: "@wildandfree.co",
    url: "https://www.instagram.com/wildandfree.co/",
    platform: "instagram",
    description:
      "Nature-forward homeschool community with group meetup inspiration and outdoor learning ethos.",
  },

  // TikTok — top 10 homeschool creators
  {
    id: "tt-homeschool-pop",
    name: "Homeschool Pop",
    handle: "@homeschoolpop",
    url: "https://www.tiktok.com/@homeschoolpop",
    platform: "tiktok",
    description:
      "Bite-sized educational clips and fun facts that reinforce lessons for younger homeschoolers.",
  },
  {
    id: "tt-brave-writer",
    name: "Brave Writer",
    handle: "@bravelwriter",
    url: "https://www.tiktok.com/@bravelwriter",
    platform: "tiktok",
    description:
      "Quick writing tips, book recommendations, and encouragement for raising confident writers.",
  },
  {
    id: "tt-jady-a",
    name: "Jady A",
    handle: "@jady.a",
    url: "https://www.tiktok.com/@jady.a",
    platform: "tiktok",
    description:
      "Homeschool hauls, day-in-the-life vlogs, and candid takes on managing a busy homeschool household.",
  },
  {
    id: "tt-raising-lifelong",
    name: "Raising Lifelong Learners",
    handle: "@raisinglifelonglearners",
    url: "https://www.tiktok.com/@raisinglifelonglearners",
    platform: "tiktok",
    description:
      "Gifted learning hacks, boredom busters, and creative projects for curious kids.",
  },
  {
    id: "tt-good-beautiful",
    name: "The Good and the Beautiful",
    handle: "@thegoodandthebeautiful",
    url: "https://www.tiktok.com/@thegoodandthebeautiful",
    platform: "tiktok",
    description:
      "Curriculum previews, book unboxings, and homeschool organization reels from the publisher.",
  },
  {
    id: "tt-timberdoodle",
    name: "Timberdoodle",
    handle: "@timberdoodle",
    url: "https://www.tiktok.com/@timberdoodle",
    platform: "tiktok",
    description:
      "STEM kit demos, hands-on learning toys, and curriculum kit walkthroughs in short video form.",
  },
  {
    id: "tt-erica-arndt",
    name: "Erica Arndt",
    handle: "@ericarndt",
    url: "https://www.tiktok.com/@ericarndt",
    platform: "tiktok",
    description:
      "Curriculum reviews, planner setups, and real-talk homeschool mom content.",
  },
  {
    id: "tt-homeschool-on",
    name: "Homeschool On",
    handle: "@homeschool_on",
    url: "https://www.tiktok.com/@homeschool_on",
    platform: "tiktok",
    description:
      "Practical homeschool tips, schedule ideas, and curriculum comparisons for everyday families.",
  },
  {
    id: "tt-waldorf-method",
    name: "The Waldorf Method",
    handle: "@thewaldorfmethod",
    url: "https://www.tiktok.com/@thewaldorfmethod",
    platform: "tiktok",
    description:
      "Waldorf-inspired rhythms, handwork projects, and holistic learning approaches for young children.",
  },
  {
    id: "tt-homeschool-mom",
    name: "That Homeschool Mom",
    handle: "@thathomeschoolmom",
    url: "https://www.tiktok.com/@thathomeschoolmom",
    platform: "tiktok",
    description:
      "Relatable homeschool humor, routine tips, and honest conversations about the homeschool journey.",
  },

  // Pinterest — top 10 homeschool boards and accounts
  {
    id: "pin-timberdoodle",
    name: "Timberdoodle",
    handle: "@timberdoodle",
    url: "https://www.pinterest.com/timberdoodle/",
    platform: "pinterest",
    description:
      "Curated boards for STEM kits, hands-on curriculum, and creative learning supplies.",
  },
  {
    id: "pin-good-beautiful",
    name: "The Good and the Beautiful",
    handle: "@thegoodandthebeautiful",
    url: "https://www.pinterest.com/thegoodandthebeautiful/",
    platform: "pinterest",
    description:
      "Free printables, book lists, and faith-based learning activity pins from the curriculum publisher.",
  },
  {
    id: "pin-scm",
    name: "Simply Charlotte Mason",
    handle: "@simplycharlottemason",
    url: "https://www.pinterest.com/simplycharlottemason/",
    platform: "pinterest",
    description:
      "Living books, nature study, and habit-training resources organized into searchable boards.",
  },
  {
    id: "pin-wild-free",
    name: "Wild + Free",
    handle: "@wildandfree.co",
    url: "https://www.pinterest.com/wildandfreeco/",
    platform: "pinterest",
    description:
      "Outdoor learning, nature journaling, and adventure-based homeschool inspiration.",
  },
  {
    id: "pin-raising-lifelong",
    name: "Raising Lifelong Learners",
    handle: "@raisinglifelonglearners",
    url: "https://www.pinterest.com/raisinglifelonglearners/",
    platform: "pinterest",
    description:
      "Gifted education projects, science activities, and creative learning ideas for curious kids.",
  },
  {
    id: "pin-confessions",
    name: "Confessions of a Homeschooler",
    handle: "@confessionsofahomeschooler",
    url: "https://www.pinterest.com/confessionsofahomeschooler/",
    platform: "pinterest",
    description:
      "Printable worksheets, lapbooks, and unit-study resources from a veteran homeschool blogger.",
  },
  {
    id: "pin-hip-moms",
    name: "Hip Homeschool Moms",
    handle: "@hiphomeschoolmoms",
    url: "https://www.pinterest.com/hiphomeschoolmoms/",
    platform: "pinterest",
    description:
      "Curriculum roundups, seasonal activities, and homeschool room organization ideas.",
  },
  {
    id: "pin-homeschool-planning",
    name: "Homeschool Planning & Organization",
    handle: "Curated Board",
    url: "https://www.pinterest.com/search/pins/?q=homeschool%20planning",
    platform: "pinterest",
    description:
      "Planners, schedule templates, and organization systems pinned by thousands of homeschool families.",
  },
  {
    id: "pin-nature-study",
    name: "Homeschool Nature Study",
    handle: "Curated Board",
    url: "https://www.pinterest.com/search/pins/?q=homeschool%20nature%20study",
    platform: "pinterest",
    description:
      "Nature walks, journaling prompts, and outdoor science activities for Charlotte Mason families.",
  },
  {
    id: "pin-unit-studies",
    name: "Homeschool Unit Studies",
    handle: "Curated Board",
    url: "https://www.pinterest.com/search/pins/?q=homeschool%20unit%20studies",
    platform: "pinterest",
    description:
      "Thematic unit-study ideas spanning history, science, and literature for multi-age learning.",
  },

  // X (Twitter) — top 10 homeschool accounts
  {
    id: "x-hslda",
    name: "HSLDA",
    handle: "@HSLDA",
    url: "https://x.com/HSLDA",
    platform: "x",
    description:
      "Legal alerts, legislative updates, and homeschool rights advocacy from the leading defense association.",
  },
  {
    id: "x-homeschool-com",
    name: "Homeschool.com",
    handle: "@homeschool",
    url: "https://x.com/homeschool",
    platform: "x",
    description:
      "Curriculum news, resource links, and community conversation from a long-running homeschool portal.",
  },
  {
    id: "x-old-schoolhouse",
    name: "The Old Schoolhouse",
    handle: "@TOSMagazine",
    url: "https://x.com/TOSMagazine",
    platform: "x",
    description:
      "Magazine articles, conference announcements, and homeschool industry news in real time.",
  },
  {
    id: "x-simple-homeschool",
    name: "Simple Homeschool",
    handle: "@simplehs",
    url: "https://x.com/simplehs",
    platform: "x",
    description:
      "Thoughtful takes on simplifying homeschool life from Jamie Martin and contributors.",
  },
  {
    id: "x-classical-conversations",
    name: "Classical Conversations",
    handle: "@ClassicalConv",
    url: "https://x.com/ClassicalConv",
    platform: "x",
    description:
      "Classical education community updates, event info, and parent resources from the national network.",
  },
  {
    id: "x-brave-writer",
    name: "Brave Writer",
    handle: "@bravelwriter",
    url: "https://x.com/bravelwriter",
    platform: "x",
    description:
      "Writing program updates, book club announcements, and Julie Bogart's homeschool wisdom.",
  },
  {
    id: "x-pam-barnhill",
    name: "Pam Barnhill",
    handle: "@PamBarnhill",
    url: "https://x.com/PamBarnhill",
    platform: "x",
    description:
      "Planning tips, podcast updates, and morning basket inspiration for organized homeschoolers.",
  },
  {
    id: "x-timberdoodle",
    name: "Timberdoodle",
    handle: "@timberdoodle",
    url: "https://x.com/timberdoodle",
    platform: "x",
    description:
      "New product launches, curriculum kit highlights, and hands-on learning recommendations.",
  },
  {
    id: "x-secular-homeschool",
    name: "Secular Homeschool",
    handle: "@SecularHS",
    url: "https://x.com/SecularHS",
    platform: "x",
    description:
      "Non-religious curriculum picks, secular resource roundups, and inclusive homeschool community.",
  },
  {
    id: "x-abeka",
    name: "Abeka",
    handle: "@Abeka",
    url: "https://x.com/Abeka",
    platform: "x",
    description:
      "Christian curriculum updates, teaching tips, and homeschool encouragement from the Abeka team.",
  },
];

export function getChannelsByPlatform(platform: SocialPlatform): SocialMediaChannel[] {
  return homeschoolSocialChannels.filter((channel) => channel.platform === platform);
}

export function socialChannelsToSeedInputs() {
  return homeschoolSocialChannels.map((channel) => ({
    title: `${channel.name} (${socialPlatformOptions.find((p) => p.value === channel.platform)?.label})`,
    listingType: "social_media" as const,
    format: "online" as const,
    priceType: "free" as const,
    websiteUrl: channel.url,
    shortDescription: channel.description,
    description: `${channel.description} Follow ${channel.handle} on ${socialPlatformOptions.find((p) => p.value === channel.platform)?.label}.`,
    subjects: [channel.platform],
    values: ["tech_friendly"],
    philosophies: ["eclectic"],
    religions: ["secular", "christian"],
    isFeatured: false,
  }));
}
