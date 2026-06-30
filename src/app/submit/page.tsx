import { brand } from "@/lib/brand-vocabulary";
import { SubmitForm } from "@/components/community/submit-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SubmitPage() {
  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            {brand.submit.title}
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            Share a resource with the fleet
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">{brand.submit.subtitle}</p>
        </div>
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Card className="border-[var(--color-border)] bg-white/90">
          <CardHeader>
            <CardTitle>Resource submission</CardTitle>
            <CardDescription>
              Submissions enter the moderation queue for review before appearing in the directory.
              Local co-ops and support groups can pin themselves on the harbor map when you include
              city and state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubmitForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
