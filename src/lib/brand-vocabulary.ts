export const brand = {
  siteName: "Homeschool Lighthouse",
  tagline: "Shining the light on trusted homeschool resources",
  heroTagline: "Follow the Light to Your Family's Perfect Homeschool Path",
  heroTaglineShort: "Find Your Perfect Homeschool Path",
  search: {
    title: "Chart Your Course",
    placeholder: "Search curricula, conferences, CLT, scholarships…",
    hint: "Try: CLT, homeschool convention, college scholarship Virginia",
  },
  browse: {
    title: "Chart Your Course",
    subtitle: "Find trusted resources to guide your homeschool journey",
  },
  nav: {
    chart: "Chart a Course",
    beacons: "Beacons",
    harbors: "Local Harbors",
    huddle: "Harbor Huddle",
    bookshelf: "Lighthouse Library",
    creditLogbook: "The Credit Logbook",
    blog: "Fair Winds Weekly",
    captainsLog: "Captain's Log",
    premium: "Lighthouse Premium",
  },
  filters: {
    title: "Set Your Bearing",
    basic: "Near Shore",
    advanced: "Open Waters",
    chips: "Your Current Bearing",
    location: "Search These Waters",
    more: "More Bearings",
  },
  sort: {
    title: "Order Your Route",
    relevance: "Best Match",
    rating: "Top Signals",
    newest: "Recently Lit",
    alpha: "A to Z",
    priceLow: "Calm Waters",
    priceHigh: "Deep Waters",
    distance: "Nearest Harbor",
  },
  group: {
    title: "Fleet Formation",
    none: "All Together",
    category: "By Type",
    philosophy: "By Philosophy",
    state: "By State",
    format: "By Format",
    price: "By Price",
  },
  favorites: "Anchored Resources",
  savedSearches: "Charted Courses",
  ai: {
    title: "Follow the Light",
    subtitle: "Tell us about your learner and we'll light the way",
  },
  submit: {
    title: "Send a Signal",
    subtitle: "Share a resource to help other families navigate",
  },
  reviews: "Signals from the Fleet",
  huddle: {
    title: "Harbor Huddle",
    subtitle: "Our monthly mega-thread for premium families to swap tips, encouragement, and homeschool wisdom.",
    paywallMessage:
      "The Harbor Huddle is a premium-only space. Unlock the Full Beam to join the monthly conversation.",
  },
  creditLogbook: {
    title: "The Credit Logbook",
    tagline: "Chart credit hours across the high school voyage",
    subtitle:
      "A formal transcript worksheet for homeschool parents. Select broad curriculum subjects like Pre-Algebra, Chemistry, and Literature, assign letter grades, and watch credit hours and GPA update instantly across all four years.",
    paywallMessage:
      "The Credit Logbook is a premium navigation tool. Unlock the Full Beam to plan four years of courses, calculate Carnegie credit hours, track GPA, and print or export your transcript summary.",
  },
  bookshelf: {
    title: "The Lighthouse Library",
    tagline: "300 Living Books to Light the Whole Voyage",
    subtitle:
      "Our master chart of living classical and inspirational literature — 50 hand-picked books for every age and grade, from first read-alouds in the nursery to the great books of the senior year. Each entry gives the author, year, a one-paragraph summary, the character traits it builds, its difficulty level, and the subjects it teaches.",
    paywallMessage:
      "The full Lighthouse Library — all 300 charted books with summaries, character traits, difficulty levels, and subjects — is a premium treasure. Unlock the Full Beam to open every shelf.",
  },
  blog: {
    series: "Fair Winds Weekly",
    title: "Fair Winds Weekly",
    subtitle:
      "Weekly homeschool dispatches from the Lighthouse Crew — practical navigation, encouragement, and calm headings for your voyage.",
  },
  featured: "Bright Beacons",
  featuredSubtitle: "Find Your Beacon",
  upgrade: {
    title: "Unlock the Full Beam",
    subtitle: "Get advanced filters, saved searches, and full navigation tools",
  },
  pricing: {
    title: "Keep the Light Burning",
    freeTeaser: "Start Free in Safe Waters",
    premiumTeaser: "Upgrade to Full Beam Navigation",
    yearly: "$7.77/year",
    lifetime: "$14.99 lifetime",
    yearlyLabel: "Annual Pass",
    lifetimeLabel: "Lifetime Beacon",
  },
  account: {
    title: "Captain's Log",
  },
  empty: {
    title: "No Beacons Found",
    subtitle: "Try adjusting your bearing or widening your search",
  },
  stats: {
    listings: "16,000+",
    listingsLabel: "trusted resources",
  },
  newsletter: {
    title: "Join the Crew",
    subtitle: "Monthly Beacon Bulletins with Bright Beacons, seasonal homeschool guidance, and new routes.",
  },
} as const;

export const homeTestimonials = [
  {
    quote:
      "This lighthouse guided us through rough waters when we were new to homeschooling. We found our curriculum, co-op, and community in one place.",
    author: "Sarah M.",
    detail: "Classical homeschool mom of 3, Virginia",
  },
  {
    quote:
      "The filters finally speak our language. Charlotte Mason, special needs friendly, and local support groups without endless scrolling.",
    author: "James & Elena R.",
    detail: "Eclectic family, Texas",
  },
  {
    quote:
      "We upgraded to Full Beam and saved our charted courses. It feels like having a navigator who already knows the homeschool sea.",
    author: "Michelle T.",
    detail: "Premium member, Ohio",
  },
] as const;

export const exploreRoutes = [
  {
    title: "New to Homeschooling",
    description: "Start your voyage with curated first-year resources.",
    href: "/browse?q=new+homeschool",
  },
  {
    title: "High School Prep",
    description: "Chart a course through transcripts, credits, and college prep.",
    href: "/credit-logbook",
  },
  {
    title: "Special Needs Navigation",
    description: "Find neurodivergent-friendly and adaptive resources.",
    href: "/browse?values=special_needs,neurodivergent_friendly",
  },
] as const;
