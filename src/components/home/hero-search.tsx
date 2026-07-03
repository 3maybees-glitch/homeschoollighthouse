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
      <div className="flex flex-col gap-2 sm:block sm:gap-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-muted-foreground)] sm:left-5" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={brand.search.placeholder}
            className="h-12 rounded-2xl border-[var(--color-border)] bg-white/95 pl-11 pr-4 text-base text-black shadow-lg shadow-[rgba(0,31,63,0.08)] backdrop-blur focus-visible:ring-[var(--color-ring)] sm:h-14 sm:pl-14 sm:pr-36"
            aria-label="Search homeschool resources"
          />
          <Button
            type="submit"
            size="sm"
            className="hidden rounded-xl px-5 sm:absolute sm:right-2 sm:top-1/2 sm:inline-flex sm:-translate-y-1/2"
          >
            {brand.search.title}
          </Button>
        </div>
        <Button type="submit" className="h-11 w-full rounded-xl sm:hidden">
          {brand.search.title}
        </Button>
      </div>
      <p className="mt-2 hidden text-sm text-slate-400 sm:mt-3 sm:block">{brand.search.hint}</p>
    </form>
  );
}
