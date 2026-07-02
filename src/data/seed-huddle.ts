import type { HarborHuddle, HuddleReply } from "@/types/community";

export const seedHuddles: HarborHuddle[] = [
  {
    id: "huddle-2026-06",
    monthKey: "2026-06",
    title: "Harbor Huddle — June 2026",
    prompt:
      "Summer planning is in full swing. What are you keeping, pausing, or trying fresh before the next school year? Share your June homeschool rhythm — camps, light academics, co-op wrap-ups, or full rest mode.",
    authorName: "Lighthouse Crew",
    createdAt: "2026-06-01T12:00:00.000Z",
    isPinned: true,
  },
  {
    id: "huddle-2026-07",
    monthKey: "2026-07",
    title: "Harbor Huddle — July 2026",
    prompt:
      "Mid-summer check-in: How is your family recharging? Tell us about a curriculum you are previewing for fall, a local harbor (co-op or group) you discovered, or one thing you wish you had known earlier in your homeschool voyage.",
    authorName: "Lighthouse Crew",
    createdAt: "2026-07-01T12:00:00.000Z",
    isPinned: true,
  },
];

export const seedHuddleReplies: HuddleReply[] = [
  {
    id: "reply-2026-07-1",
    huddleId: "huddle-2026-07",
    authorName: "Sarah M.",
    body: "We dropped formal math for July and switched to games and cooking measurements. Best decision we've made — my middle schooler is actually asking to do more.",
    createdAt: "2026-07-02T09:15:00.000Z",
  },
  {
    id: "reply-2026-07-2",
    huddleId: "huddle-2026-07",
    authorName: "James & Elena R.",
    body: "Found a Charlotte Mason co-op through Local Harbors that meets twice a month. Already met two families with high schoolers — huge for our planning conversations.",
    createdAt: "2026-07-03T14:40:00.000Z",
  },
  {
    id: "reply-2026-06-1",
    huddleId: "huddle-2026-06",
    authorName: "Michelle T.",
    body: "We are doing 'morning basket lite' — 30 minutes of read-aloud and one subject, then outside the rest of the day. Keeps momentum without burning out.",
    createdAt: "2026-06-05T11:20:00.000Z",
  },
];
