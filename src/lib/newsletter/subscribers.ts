import { fetchNewsletterSubscriber, insertNewsletterSubscriber } from "@/lib/newsletter/supabase-rest";
import { memoryStore } from "@/lib/store/memory-store";
import type { NewsletterSubscriber } from "@/types/newsletter";

type AddSubscriberResult =
  | { subscriber: NewsletterSubscriber; isNew: boolean; storage: "supabase" }
  | { subscriber: NewsletterSubscriber; isNew: boolean; storage: "memory" };

function toSubscriber(row: { id: string; email: string; created_at: string }): NewsletterSubscriber {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  };
}

export async function addNewsletterSubscriber(email: string): Promise<AddSubscriberResult> {
  const normalized = email.trim().toLowerCase();
  const existingResult = await fetchNewsletterSubscriber(normalized);

  if (existingResult.configured) {
    if (existingResult.row) {
      return {
        subscriber: toSubscriber(existingResult.row),
        isNew: false,
        storage: "supabase",
      };
    }

    const insertResult = await insertNewsletterSubscriber(normalized);
    if (!insertResult.row) {
      throw new Error("Supabase did not return the new newsletter subscriber.");
    }

    return {
      subscriber: toSubscriber(insertResult.row),
      isNew: true,
      storage: "supabase",
    };
  }

  const existing = memoryStore
    .listNewsletterSubscribers()
    .find((subscriber) => subscriber.email === normalized);

  if (existing) {
    return { subscriber: existing, isNew: false, storage: "memory" };
  }

  const subscriber = memoryStore.addNewsletterSubscriber(normalized);
  return { subscriber, isNew: true, storage: "memory" };
}
