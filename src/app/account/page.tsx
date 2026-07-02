import Link from "next/link";
import { brand } from "@/lib/brand-vocabulary";
import { getSessionProfile } from "@/lib/auth/session";
import { CaptainLogPanels } from "@/components/account/captains-log-panels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AccountPage() {
  const profile = await getSessionProfile();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        {brand.account.title}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Your homeschool navigation hub</h1>

      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
            <CardDescription>
              {profile?.tier === "premium"
                ? "You have unlocked the full beam."
                : "You are currently browsing on the free pass."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Tier: <span className="font-semibold text-slate-900">{profile?.tier ?? "free"}</span>
            </p>
            {profile?.email ? (
              <p className="text-sm text-slate-600">
                Signed in as <span className="font-semibold text-slate-900">{profile.email}</span>
              </p>
            ) : (
              <p className="text-sm text-slate-600">
                <Link href="/login?next=/account" className="font-medium text-amber-700 hover:underline">
                  Sign in
                </Link>{" "}
                to sync your Captain&apos;s Log across devices.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {profile?.tier !== "premium" ? (
                <Button asChild>
                  <Link href="/pricing">{brand.upgrade.title}</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/ai">{brand.ai.title}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/harbor-huddle">{brand.huddle.title}</Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <CaptainLogPanels tier={profile?.tier ?? "free"} />
      </div>
    </div>
  );
}
