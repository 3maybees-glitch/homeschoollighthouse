import { seedListings } from "@/data/seed-listings";
import type { Listing } from "@/types/listing";
import type { AiRecommendation } from "@/types/community";

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function scoreListing(listing: Listing, tokens: string[]) {
  const haystack = [
    listing.title,
    listing.shortDescription,
    listing.description,
    listing.listingType,
    ...listing.philosophies,
    ...listing.values,
    ...listing.religions,
    ...listing.subjects,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 2;
  }

  if (tokens.some((token) => ["secular", "religious", "christian", "catholic"].includes(token))) {
    if (listing.religions.some((religion) => tokens.includes(religion))) score += 5;
  }

  if (tokens.some((token) => ["math", "science", "reading", "writing", "history"].includes(token))) {
    if (listing.subjects.some((subject) => tokens.includes(subject))) score += 5;
  }

  const ageMatch = tokens.join(" ").match(/(\d{1,2})\s*(year|yr|yo|age)/);
  if (ageMatch) {
    const age = Number(ageMatch[1]);
    const min = listing.ageMin ?? 0;
    const max = listing.ageMax ?? 99;
    if (age >= min && age <= max) score += 6;
  }

  if (tokens.includes("free") && listing.priceType === "free") score += 8;
  if (tokens.includes("online") && listing.format === "online") score += 4;
  if (tokens.includes("local") || tokens.includes("coop") || tokens.includes("co-op")) {
    if (listing.listingType === "coop" || listing.format === "in_person") score += 4;
  }
  if (tokens.includes("neurodivergent") || tokens.includes("dyslexia") || tokens.includes("adhd")) {
    if (listing.values.includes("neurodivergent_friendly")) score += 8;
  }
  if (tokens.includes("gifted")) {
    if (listing.values.includes("gifted")) score += 8;
  }

  score += listing.ratingAvg;
  if (listing.isFeatured) score += 1;

  return score;
}

function buildReason(listing: Listing, tokens: string[]) {
  const parts: string[] = [];
  if (listing.subjects.length) parts.push(`covers ${listing.subjects.slice(0, 2).join(" & ")}`);
  if (listing.philosophies.length)
    parts.push(`aligns with ${listing.philosophies.slice(0, 2).join(" / ")}`);
  if (listing.priceType === "free") parts.push("free to start");
  if (listing.values.includes("neurodivergent_friendly")) parts.push("neurodivergent-friendly");
  if (listing.values.includes("self_paced")) parts.push("self-paced");
  if (!parts.length && tokens.length) parts.push("matches your search themes");
  return parts.join(", ") || "strong overall fit for homeschool families";
}

export function recommendListings(query: string, limit = 5): AiRecommendation[] {
  const tokens = tokenize(query);
  const ranked = seedListings
    .map((listing) => ({
      listing,
      score: scoreListing(listing, tokens),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (!ranked.length) {
    return seedListings
      .filter((listing) => listing.isFeatured)
      .slice(0, limit)
      .map((listing) => ({
        slug: listing.slug,
        title: listing.title,
        reason: "popular Bright Beacon families trust",
      }));
  }

  return ranked.map(({ listing }) => ({
    slug: listing.slug,
    title: listing.title,
    reason: buildReason(listing, tokens),
  }));
}

export async function generateAiReply(query: string) {
  const recommendations = recommendListings(query);
  const openAiKey = process.env.OPENAI_API_KEY;

  if (openAiKey) {
    try {
      const context = recommendations
        .map((rec, index) => `${index + 1}. ${rec.title} — ${rec.reason}`)
        .join("\n");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are the Homeschool Lighthouse guide. Use warm nautical lighthouse language. Recommend resources from the provided list only. Keep answers concise and practical for parents.",
            },
            {
              role: "user",
              content: `Parent question: ${query}\n\nMatching resources:\n${context}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return { message: content as string, recommendations };
        }
      }
    } catch {
      // Fall through to local reply
    }
  }

  const intro =
    recommendations.length > 0
      ? "I've swept the horizon and found a few beacons that may fit your crew:"
      : "I couldn't find a tight match, but here are trusted Bright Beacons other families love:";

  const lines = recommendations.map(
    (rec, index) => `${index + 1}. **${rec.title}** — ${rec.reason}.`,
  );

  const message = [intro, ...lines, "", "Want to narrow your bearing? Try adding age, subject, or philosophy."].join(
    "\n",
  );

  return { message, recommendations };
}
