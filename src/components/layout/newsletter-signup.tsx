"use client";

import { useState } from "react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewsletterStatus = "idle" | "loading" | "success" | "error";

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to join the crew right now.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Welcome aboard. Check your inbox soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Unable to join the crew right now. Please try again.");
    }
  }

  return (
    <div className={compact ? "w-full max-w-md" : "w-full max-w-xl"}>
      {!compact ? (
        <div className="mb-4">
          <p className="text-sm font-semibold text-white">{brand.newsletter.title}</p>
          <p className="mt-1 text-sm text-slate-400">{brand.newsletter.subtitle}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@family.com"
          aria-label="Email address for newsletter"
          className="border-white/15 bg-white/10 text-white placeholder:text-slate-400 focus:border-[var(--color-beam)] focus:ring-[var(--color-beam)]/30"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 bg-[var(--color-beam)] text-[var(--color-navy-deep)] hover:brightness-105"
        >
          {status === "loading" ? "Joining…" : "Join the Crew"}
        </Button>
      </form>

      {message ? (
        <p
          className={`mt-3 text-sm ${status === "success" ? "text-[var(--color-beam)]" : "text-rose-300"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
