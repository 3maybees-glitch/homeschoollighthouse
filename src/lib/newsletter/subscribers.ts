import { createAdminClient } from "@/lib/supabase/admin";
import { memoryStore } from "@/lib/store/memory-store";
import type { NewsletterSubscriber } from "@/types/newsletter";

type AddSubscriberResult =
  | { subscriber: NewsletterSubscriber; isNew: boolean; storage: "supabase" }
  | { subscriber: NewsletterSubscriber; isNew: boolean; storage: "memory" };

export async function addNewsletterSubscriber(email: string): Promise<AddSubscriberResult> {
  const normalized = email.trim().toLowerCase();
  const supabase = createAdminClient();

  if (supabase) {
    const { data: existing, error: existingError } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, created_at")
      .eq("email", normalized)
      .maybeSingle();

    if (existingError) {
      throw new Error(existingError.message);
    }

    if (existing) {
      return {
        subscriber: {
          id: existing.id,
          email: existing.email,
          createdAt: existing.created_at,
        },
        isNew: false,
        storage: "supabase",
      };
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: normalized })
      .select("id, email, created_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      subscriber: {
        id: data.id,
        email: data.email,
        createdAt: data.created_at,
      },
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
