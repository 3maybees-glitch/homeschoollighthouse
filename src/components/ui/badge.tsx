import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--color-primary)]/15 px-2.5 py-1 text-xs font-medium text-[var(--color-navy-deep)]",
        className,
      )}
      {...props}
    />
  );
}
