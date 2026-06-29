"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Send } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AiRecommendation } from "@/types/community";
import type { SubscriptionTier } from "@/types/listing";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  recommendations?: AiRecommendation[];
};

export function AiChat({ tier }: { tier: SubscriptionTier }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ahoy! I'm your lighthouse guide. Tell me about your learner — age, interests, teaching style — and I'll light the way to resources that fit.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (tier !== "premium") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-amber-600" />
        <h2 className="mt-4 text-2xl font-bold text-slate-900">{brand.ai.title}</h2>
        <p className="mt-2 text-slate-600">{brand.ai.subtitle}</p>
        <p className="mt-4 text-sm text-amber-900">
          AI discovery is a premium feature. Unlock the Full Beam to chat with your lighthouse guide.
        </p>
        <Button asChild className="mt-6">
          <Link href="/pricing">{brand.upgrade.title}</Link>
        </Button>
      </div>
    );
  }

  const send = async () => {
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setError("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not reach the lighthouse guide.");
        return;
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.message,
          recommendations: data.recommendations,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border bg-white/90 shadow-sm">
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{brand.ai.title}</h2>
            <p className="text-sm text-slate-600">{brand.ai.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-h-[32rem] space-y-4 overflow-y-auto px-6 py-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-12 bg-slate-900 text-white"
                : "mr-12 bg-amber-50 text-slate-800"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.recommendations?.length ? (
              <div className="mt-4 space-y-2 border-t border-amber-200 pt-3">
                <p className="font-medium text-amber-900">Recommended beacons:</p>
                {message.recommendations.map((rec) => (
                  <Link
                    key={rec.slug}
                    href={`/listing/${rec.slug}`}
                    className="block rounded-xl bg-white px-3 py-2 text-slate-800 hover:bg-amber-100"
                  >
                    <span className="font-semibold">{rec.title}</span>
                    <span className="mt-1 block text-xs text-slate-600">{rec.reason}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {loading ? <p className="text-sm text-slate-500">Sweeping the horizon…</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="flex gap-2 border-t px-6 py-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. secular science for a 7-year-old who loves hands-on projects"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <Button onClick={send} disabled={loading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
