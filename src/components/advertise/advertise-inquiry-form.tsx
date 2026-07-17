"use client";

import { useState } from "react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormStatus = "idle" | "loading" | "success" | "error";

export function AdvertiseInquiryForm({ defaultPlan = "monthly" }: { defaultPlan?: string }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState(defaultPlan);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      businessName: String(form.get("businessName") ?? ""),
      contactName: String(form.get("contactName") ?? ""),
      email: String(form.get("email") ?? ""),
      website: String(form.get("website") ?? ""),
      plan: String(form.get("plan") ?? plan),
      message: String(form.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/advertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to send your inquiry right now.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Thanks — we’ll be in touch soon.");
      event.currentTarget.reset();
      setPlan(defaultPlan);
    } catch {
      setStatus("error");
      setMessage("Unable to send your inquiry right now. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input id="businessName" name="businessName" required placeholder="Your curriculum or company" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact name</Label>
          <Input id="contactName" name="contactName" required placeholder="Who should we reply to?" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@business.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" placeholder="https://" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan">Plan interest</Label>
        <select
          id="plan"
          name="plan"
          value={plan}
          onChange={(event) => setPlan(event.target.value)}
          className="flex h-10 w-full rounded-full border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-navy-deep)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)]"
        >
          <option value="monthly">Monthly Bright Beacon — {brand.advertise.monthly}</option>
          <option value="yearly">Annual Bright Beacon — {brand.advertise.yearly}</option>
          <option value="upsell">Custom / upsell package</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Tell us about your resource</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Who you serve, what makes your offering unique, and when you’d like to go live…"
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-navy-deep)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)]"
        />
      </div>

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Request a Bright Beacon spot"}
      </Button>

      {message ? (
        <p
          className={`text-sm ${status === "success" ? "text-[var(--color-secondary)]" : "text-rose-600"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
