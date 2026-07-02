import { randomUUID } from "crypto";
import type {
  Favorite,
  HarborHuddle,
  HuddleReply,
  Review,
  SavedSearch,
  Submission,
} from "@/types/community";
import type { NewsletterSubscriber } from "@/types/newsletter";
import type { Listing } from "@/types/listing";
import { seedHuddleReplies, seedHuddles } from "@/data/seed-huddle";
import { seedReviews } from "@/data/seed-reviews";
import {
  defaultHuddlePrompt,
  defaultHuddleTitle,
  getMonthKey,
} from "@/lib/harbor-huddle/month";
import { submissionToListing } from "@/lib/listings/submission-to-listing";

const reviews: Review[] = [...seedReviews];
const huddles: HarborHuddle[] = [...seedHuddles];
const huddleReplies: HuddleReply[] = [...seedHuddleReplies];
const submissions: Submission[] = [];
const publishedListings: Listing[] = [];
const favorites: Favorite[] = [];
const savedSearches: SavedSearch[] = [];
const newsletterSubscribers: NewsletterSubscriber[] = [];

export const memoryStore = {
  listReviews(listingId?: string, listingSlug?: string) {
    if (!listingId && !listingSlug) return reviews;
    return reviews.filter(
      (review) =>
        (listingId && review.listingId === listingId) ||
        (listingSlug && review.listingSlug === listingSlug),
    );
  },

  addReview(input: Omit<Review, "id" | "createdAt" | "helpfulCount">) {
    const review: Review = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
    };
    reviews.unshift(review);
    return review;
  },

  listSubmissions(status?: Submission["status"]) {
    if (!status) return submissions;
    return submissions.filter((submission) => submission.status === status);
  },

  addSubmission(input: Omit<Submission, "id" | "status" | "createdAt">) {
    const submission: Submission = {
      ...input,
      id: randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    submissions.unshift(submission);
    return submission;
  },

  updateSubmissionStatus(id: string, status: Submission["status"]) {
    const submission = submissions.find((item) => item.id === id);
    if (!submission) return null;
    submission.status = status;

    if (status === "approved") {
      const listing = submissionToListing(submission);
      const existingIndex = publishedListings.findIndex((item) => item.id === listing.id);
      if (existingIndex === -1) {
        publishedListings.unshift(listing);
      } else {
        publishedListings[existingIndex] = listing;
      }
    }

    return submission;
  },

  getPublishedListings() {
    return [...publishedListings];
  },

  listFavorites(userId: string) {
    return favorites.filter((favorite) => favorite.userId === userId);
  },

  addFavorite(userId: string, listingId: string, listingSlug: string) {
    const existing = favorites.find(
      (favorite) =>
        favorite.userId === userId &&
        (favorite.listingId === listingId || favorite.listingSlug === listingSlug),
    );
    if (existing) return existing;

    const favorite: Favorite = {
      id: randomUUID(),
      userId,
      listingId,
      listingSlug,
      createdAt: new Date().toISOString(),
    };
    favorites.push(favorite);
    return favorite;
  },

  removeFavorite(userId: string, listingSlug: string) {
    const index = favorites.findIndex(
      (favorite) => favorite.userId === userId && favorite.listingSlug === listingSlug,
    );
    if (index === -1) return false;
    favorites.splice(index, 1);
    return true;
  },

  listSavedSearches(userId: string) {
    return savedSearches.filter((search) => search.userId === userId);
  },

  addSavedSearch(userId: string, name: string, queryString: string) {
    const saved: SavedSearch = {
      id: randomUUID(),
      userId,
      name,
      queryString,
      createdAt: new Date().toISOString(),
    };
    savedSearches.unshift(saved);
    return saved;
  },

  removeSavedSearch(userId: string, id: string) {
    const index = savedSearches.findIndex(
      (search) => search.userId === userId && search.id === id,
    );
    if (index === -1) return false;
    savedSearches.splice(index, 1);
    return true;
  },

  addNewsletterSubscriber(email: string) {
    const normalized = email.trim().toLowerCase();
    const existing = newsletterSubscribers.find((subscriber) => subscriber.email === normalized);
    if (existing) return existing;

    const subscriber: NewsletterSubscriber = {
      id: randomUUID(),
      email: normalized,
      createdAt: new Date().toISOString(),
    };
    newsletterSubscribers.unshift(subscriber);
    return subscriber;
  },

  listNewsletterSubscribers() {
    return [...newsletterSubscribers];
  },

  ensureCurrentHuddle() {
    const monthKey = getMonthKey();
    let huddle = huddles.find((item) => item.monthKey === monthKey);
    if (!huddle) {
      huddle = {
        id: randomUUID(),
        monthKey,
        title: defaultHuddleTitle(monthKey),
        prompt: defaultHuddlePrompt(monthKey),
        authorName: "Lighthouse Crew",
        createdAt: new Date().toISOString(),
        isPinned: true,
      };
      huddles.unshift(huddle);
    }
    return huddle;
  },

  getHuddleByMonthKey(monthKey: string) {
    return huddles.find((item) => item.monthKey === monthKey) ?? null;
  },

  listHuddles() {
    return [...huddles].sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  },

  listHuddleReplies(huddleId: string) {
    return huddleReplies
      .filter((reply) => reply.huddleId === huddleId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  addHuddleReply(input: Omit<HuddleReply, "id" | "createdAt">) {
    const reply: HuddleReply = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    huddleReplies.push(reply);
    return reply;
  },
};
