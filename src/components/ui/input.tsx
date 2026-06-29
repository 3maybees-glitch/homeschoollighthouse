import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-4 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200",
        className,
      )}
      {...props}
    />
  );
}
