"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOBILE_PLACEHOLDER = "Search curricula, CLT, scholarships…";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(MOBILE_PLACEHOLDER);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const syncPlaceholder = () => {
      setPlaceholder(media.matches ? brand.search.placeholder : MOBILE_PLACEHOLDER);
    };
    syncPlaceholder();
    media.addEventListener("change", syncPlaceholder);
    return () => media.removeEventListener("change", syncPlaceholder);
  }, []);

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
    <form onSubmit={handleSubmit} className="w-full min-w-0 max-w-2xl">
      <div className="flex w-full min-w-0 flex-col gap-2 sm:block">
        <div className="relative w-full min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[var(--color-muted-foreground)] sm:left-5" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="box-border h-12 w-full min-w-0 max-w-full rounded-2xl border-[var(--color-border)] bg-white/95 pl-10 pr-3 text-base text-black shadow-lg shadow-[rgba(0,31,63,0.08)] backdrop-blur focus-visible:ring-[var(--color-ring)] sm:h-14 sm:pl-14 sm:pr-36"
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
        <Button type="submit" className="h-11 w-full max-w-full shrink rounded-xl sm:hidden">
          {brand.search.title}
        </Button>
      </div>
      <p className="mt-2 hidden text-sm text-slate-400 sm:mt-3 sm:block">{brand.search.hint}</p>
    </form>
  );
}
