/**
 * Generate the Fair Winds Weekly blog post for the current ISO week.
 * Skips if a post for this week already exists.
 *
 * Usage: node scripts/generate-weekly-blog.mjs [--week 2026-W29] [--dry-run]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { weeklyBlogTopics } from "./blog-weekly-topics.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsPath = join(__dirname, "../src/data/blog-posts.json");

function getIsoWeekKey(date = new Date()) {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const year = utc.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function parseWeekArg() {
  const index = process.argv.indexOf("--week");
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return getIsoWeekKey();
}

function weekNumberFromKey(weekKey) {
  const match = weekKey.match(/^(\d{4})-W(\d{2})$/);
  if (!match) throw new Error(`Invalid week key: ${weekKey}`);
  return Number(match[2]);
}

function publishedAtForWeek(weekKey) {
  const match = weekKey.match(/^(\d{4})-W(\d{2})$/);
  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7);
  weekStart.setUTCHours(10, 0, 0, 0);
  return weekStart.toISOString();
}

const dryRun = process.argv.includes("--dry-run");
const weekKey = parseWeekArg();
const posts = JSON.parse(readFileSync(postsPath, "utf8"));

if (posts.some((post) => post.weekKey === weekKey)) {
  console.log(`Post already exists for ${weekKey}. Nothing to do.`);
  process.exit(0);
}

const weekNum = weekNumberFromKey(weekKey);
const topic = weeklyBlogTopics[(weekNum - 1) % weeklyBlogTopics.length];
let slug = `fair-winds-weekly-${topic.slugPart}`;

if (posts.some((post) => post.slug === slug)) {
  slug = `fair-winds-weekly-${weekKey.toLowerCase()}-${topic.slugPart}`;
}

const post = {
  id: `blog-${weekKey.toLowerCase()}`,
  slug,
  title: `Fair Winds Weekly — ${topic.titlePart}`,
  excerpt: topic.excerpt,
  body: topic.body,
  tags: topic.tags,
  weekKey,
  authorName: "Lighthouse Crew",
  publishedAt: publishedAtForWeek(weekKey),
  isPublished: true,
};

posts.push(post);
posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

if (dryRun) {
  console.log(JSON.stringify(post, null, 2));
  process.exit(0);
}

writeFileSync(postsPath, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Added Fair Winds Weekly post for ${weekKey}: ${post.title}`);
