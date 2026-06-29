import { brand } from "@/lib/brand-vocabulary";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 sm:px-6">
        <p className="text-lg font-semibold text-white">{brand.siteName}</p>
        <p className="max-w-2xl text-sm text-slate-400">{brand.tagline}</p>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Homeschool Lighthouse. Guiding families through trusted
          homeschool waters.
        </p>
      </div>
    </footer>
  );
}
