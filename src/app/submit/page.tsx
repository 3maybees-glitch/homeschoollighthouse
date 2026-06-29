import { brand } from "@/lib/brand-vocabulary";
import { SubmitForm } from "@/components/community/submit-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
            Submissions enter the moderation queue for review before appearing in the directory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmitForm />
        </CardContent>
      </Card>
    </div>
  );
}
