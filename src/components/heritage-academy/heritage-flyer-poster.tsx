import Image from "next/image";
import { heritageAcademy } from "@/lib/heritage-academy";

type FlyerKey = keyof typeof heritageAcademy.flyers;

export function HeritageFlyerPoster({
  flyer,
  href,
  priority = false,
  className = "",
  label = "Apply to the Heritage Academy",
}: {
  flyer: FlyerKey;
  href?: string;
  priority?: boolean;
  className?: string;
  label?: string;
}) {
  const asset = heritageAcademy.flyers[flyer];
  const image = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className="h-auto w-full"
      sizes="(max-width: 768px) 100vw, 42vw"
    />
  );

  const frame = (
    <span className={`block overflow-hidden rounded-[1.25rem] border border-[#1a2b44]/20 bg-[#122033] shadow-sm ${className}`}>
      {image}
    </span>
  );

  if (!href) return frame;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group block transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(18,32,51,0.12)]"
      aria-label={label}
    >
      {frame}
    </a>
  );
}
