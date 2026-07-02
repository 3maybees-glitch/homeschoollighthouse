import Link from "next/link";
import { Anchor } from "lucide-react";
import { brand } from "@/lib/brand-vocabulary";
import { Button } from "@/components/ui/button";

export function HarborHuddlePaywall() {
  return (
    <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
      <Anchor className="mx-auto h-8 w-8 text-amber-600" />
      <h2 className="mt-4 text-2xl font-bold text-slate-900">{brand.huddle.title}</h2>
      <p className="mt-2 text-slate-600">{brand.huddle.subtitle}</p>
      <p className="mt-4 text-sm text-amber-900">{brand.huddle.paywallMessage}</p>
      <Button asChild className="mt-6">
        <Link href="/pricing">{brand.upgrade.title}</Link>
      </Button>
    </div>
  );
}
