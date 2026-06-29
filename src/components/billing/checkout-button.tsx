"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { StripePlan } from "@/lib/stripe";

export function CheckoutButton({ plan }: { plan: StripePlan }) {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error ?? "Stripe is not configured yet. Add your Stripe keys to enable checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={startCheckout} disabled={loading} className="w-full">
      {loading ? "Opening checkout…" : plan === "yearly" ? "Choose Annual Pass" : "Choose Lifetime Beacon"}
    </Button>
  );
}
