import Image from "next/image";
import { BookOpen, ExternalLink, Landmark, Map } from "lucide-react";
import { faithFreedomMaps } from "@/lib/faith-freedom-maps";
import { Badge } from "@/components/ui/badge";

export function FaithFreedomMapsPromo() {
  return (
    <section
      id="faith-freedom-maps"
      aria-labelledby="faith-freedom-maps-heading"
      className="border-y border-[var(--color-border)] bg-[linear-gradient(120deg,rgba(255,249,230,0.75),rgba(255,255,255,0.95)_42%,rgba(232,246,244,0.7))]"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {faithFreedomMaps.eyebrow}
            </p>
            <h2
              id="faith-freedom-maps-heading"
              className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)] sm:text-4xl"
            >
              {faithFreedomMaps.headline}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted-foreground)]">
              {faithFreedomMaps.body}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                Faith · Soul Explorer
              </Badge>
              <Badge className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                Freedom · Liberty Explorer
              </Badge>
              <Badge className="bg-[var(--color-muted)]/60 text-[var(--color-muted-foreground)]">
                Etsy digital downloads
              </Badge>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href={faithFreedomMaps.faith.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-white/85 p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-navy-deep)]">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--color-navy-deep)]">
                    {faithFreedomMaps.faith.label}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-muted-foreground)]">
                    {faithFreedomMaps.faith.description}
                  </span>
                </span>
              </a>

              <a
                href={faithFreedomMaps.freedom.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-white/85 p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                  <Landmark className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--color-navy-deep)]">
                    {faithFreedomMaps.freedom.label}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-muted-foreground)]">
                    {faithFreedomMaps.freedom.description}
                  </span>
                </span>
              </a>
            </div>

            <p className="mt-5 text-sm text-[var(--color-muted-foreground)]">
              Shop on Etsy ·{" "}
              <a
                href={faithFreedomMaps.shopUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--color-secondary)] underline-offset-4 hover:underline"
              >
                MaybeeCreates
              </a>
              {" · "}Faith &amp; Freedom maps only
            </p>
          </div>

          <a
            href={faithFreedomMaps.shopUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgba(0,31,63,0.08)]"
            aria-label={`Browse ${faithFreedomMaps.productName} on Etsy`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={faithFreedomMaps.mapPreviewUrl}
                alt="Sample Liberty Explorer educational discovery world map"
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,31,63,0.55))]" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    {faithFreedomMaps.brandName}
                  </p>
                  <p className="font-display text-xl font-semibold">{faithFreedomMaps.productName}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <Map className="h-3.5 w-3.5" aria-hidden="true" />
                  On Etsy
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
