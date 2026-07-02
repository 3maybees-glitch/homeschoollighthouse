import { notFound } from "next/navigation";
import { brand } from "@/lib/brand-vocabulary";
import { getUserTier } from "@/lib/auth/session";
import { getMonthKey } from "@/lib/harbor-huddle/month";
import { memoryStore } from "@/lib/store/memory-store";
import { HarborHuddlePanel } from "@/components/community/harbor-huddle-panel";

export const metadata = {
  title: brand.huddle.title,
  description: brand.huddle.subtitle,
};

export default async function HarborHuddlePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const monthKey = params.month ?? getMonthKey();
  const tier = await getUserTier();
  const isPremium = tier === "premium";

  const huddle =
    memoryStore.getHuddleByMonthKey(monthKey) ??
    (monthKey === getMonthKey() ? memoryStore.ensureCurrentHuddle() : null);

  if (!huddle) {
    notFound();
  }

  const replies = memoryStore.listHuddleReplies(huddle.id);
  const archives = memoryStore.listHuddles().map((item) => ({
    monthKey: item.monthKey,
    title: item.title,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        Premium Community
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-slate-950">{brand.huddle.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">{brand.huddle.subtitle}</p>

      {!isPremium ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
          {brand.huddle.freeTeaser}
        </p>
      ) : null}

      <div className="mt-8">
        <HarborHuddlePanel
          tier={tier}
          initialHuddle={huddle}
          initialReplies={isPremium ? replies : replies.slice(0, 2)}
          replyCount={replies.length}
          archives={archives}
          selectedMonthKey={monthKey}
        />
      </div>
    </div>
  );
}
