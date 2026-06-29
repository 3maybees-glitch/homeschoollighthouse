import { randomUUID } from "crypto";
import type { Favorite, Review, SavedSearch, Submission } from "@/types/community";
import type { Listing } from "@/types/listing";
import { seedReviews } from "@/data/seed-reviews";
import { submissionToListing } from "@/lib/listings/submission-to-listing";

const reviews: Review[] = [...seedReviews];
const submissions: Submission[] = [];
const publishedListings: Listing[] = [];
const favorites: Favorite[] = [];
const savedSearches: SavedSearch[] = [];

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
};
