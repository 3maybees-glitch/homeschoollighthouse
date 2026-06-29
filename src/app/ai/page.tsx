import { brand } from "@/lib/brand-vocabulary";
import { getUserTier } from "@/lib/auth/session";
import { AiChat } from "@/components/community/ai-chat";

export default async function AiPage() {
  const tier = await getUserTier();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        Premium Discovery
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">{brand.ai.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{brand.ai.subtitle}</p>
      <div className="mt-8">
        <AiChat tier={tier} />
      </div>
    </div>
  );
}
