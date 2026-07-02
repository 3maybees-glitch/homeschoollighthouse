"use client";

import { useState } from "react";
import Link from "next/link";
import { Anchor, MessageCircle, Pin } from "lucide-react";
import { formatMonthLabel } from "@/lib/harbor-huddle/month";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HarborHuddle, HuddleReply } from "@/types/community";

interface HuddleArchive {
  monthKey: string;
  title: string;
}

export function HarborHuddlePanel({
  initialHuddle,
  initialReplies,
  replyCount,
  archives,
  selectedMonthKey,
}: {
  initialHuddle: HarborHuddle;
  initialReplies: HuddleReply[];
  replyCount: number;
  archives: HuddleArchive[];
  selectedMonthKey: string;
}) {
  const [huddle] = useState(initialHuddle);
  const [replies, setReplies] = useState(initialReplies);
  const [totalReplies, setTotalReplies] = useState(replyCount);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReply = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/harbor-huddle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthKey: huddle.monthKey,
          authorName,
          body,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not post your reply.");
        return;
      }

      setReplies((current) => [...current, data.reply]);
      setTotalReplies((count) => count + 1);
      setBody("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {archives.map((archive) => {
          const isActive = archive.monthKey === selectedMonthKey;
          return (
            <Link
              key={archive.monthKey}
              href={`/harbor-huddle?month=${archive.monthKey}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:text-amber-800"
              }`}
            >
              {formatMonthLabel(archive.monthKey)}
            </Link>
          );
        })}
      </div>

      <article className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
            <Pin className="h-3.5 w-3.5" />
            Pinned
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
            <MessageCircle className="h-4 w-4" />
            {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
          </span>
        </div>

        <h2 className="mt-4 font-display text-3xl font-bold text-slate-950">{huddle.title}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Opened by {huddle.authorName} · {new Date(huddle.createdAt).toLocaleDateString()}
        </p>

        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
          {huddle.prompt}
        </p>
      </article>

      <section className="rounded-3xl border bg-white/90 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">Drop your reply</h3>
        <p className="mt-1 text-sm text-slate-600">
          Share encouragement, curriculum tips, or questions with other premium families.
        </p>

        <div className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-4">
          <div className="space-y-2">
            <Label htmlFor="huddle-author">Your name</Label>
            <Input
              id="huddle-author"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="How you'd like to appear"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="huddle-body">Your reply</Label>
            <textarea
              id="huddle-body"
              className="min-h-32 w-full rounded-2xl border px-4 py-3 text-sm"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What is working in your homeschool harbor this month?"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={submitReply} disabled={isSubmitting || !body.trim()}>
            {isSubmitting ? "Posting..." : "Post to the Huddle"}
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Anchor className="h-5 w-5 text-amber-700" />
          <h3 className="text-xl font-bold text-slate-900">Fleet replies</h3>
        </div>

        {replies.length === 0 ? (
          <p className="rounded-2xl border bg-slate-50 p-5 text-sm text-slate-500">
            No replies yet. Be the first to light the conversation.
          </p>
        ) : (
          replies.map((reply) => (
            <article key={reply.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-700">{reply.body}</p>
              <p className="mt-3 text-xs text-slate-500">
                {reply.authorName} · {new Date(reply.createdAt).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
