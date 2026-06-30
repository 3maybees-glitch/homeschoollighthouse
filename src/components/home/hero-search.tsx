"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/browse");
      return;
    }
    router.push(`/browse?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={brand.search.placeholder}
          className="h-14 rounded-2xl border-[var(--color-border)] bg-white/95 pl-14 pr-36 text-base shadow-lg shadow-[rgba(0,31,63,0.08)] backdrop-blur focus-visible:ring-[var(--color-ring)]"
          aria-label="Search homeschool resources"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-5"
        >
          {brand.search.title}
        </Button>
      </div>
      <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">{brand.search.hint}</p>
    </form>
  );
}
