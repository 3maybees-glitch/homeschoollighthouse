import Link from "next/link";
import { Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "You're offline",
  description: "Reconnect to keep exploring Homeschool Lighthouse.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-navy)]">
        <Anchor className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
        Homeschool Lighthouse
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl">
        You&apos;re offline
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--color-muted-foreground)]">
        Search, maps, and Premium tools need a connection. Reconnect when you can, or retry this page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/browse">Browse resources</Link>
        </Button>
      </div>
    </div>
  );
}
