import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listingTypeOptions } from "@/lib/directory/filter-config";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        {brand.submit.title}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Share a resource with the fleet</h1>
      <p className="mt-4 text-lg text-slate-600">{brand.submit.subtitle}</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resource submission</CardTitle>
          <CardDescription>
            Submissions will enter a moderation queue once Supabase auth is connected.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Resource name</Label>
            <Input id="title" placeholder="e.g. Lighthouse Learning Co-op" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input id="website" placeholder="https://example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Resource type</Label>
            <select
              id="type"
              className="flex h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-4 text-sm"
              defaultValue="curriculum"
            >
              {listingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="min-h-32 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
              placeholder="Tell families why this resource is worth charting."
            />
          </div>
          <Button type="button">Send Signal (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
