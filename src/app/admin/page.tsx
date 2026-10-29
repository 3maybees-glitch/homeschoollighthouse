import type { Metadata } from "next";
import { AdminQueue } from "@/components/admin/admin-queue";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Moderation Queue",
  description: "Review homeschool resource submissions before they join the directory.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        Lighthouse Keeper
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Moderation Queue</h1>
      <p className="mt-4 text-lg text-slate-600">
        Review and approve community submissions before they join the directory.
      </p>
      <div className="mt-8">
        <AdminQueue />
      </div>
    </div>
  );
}
