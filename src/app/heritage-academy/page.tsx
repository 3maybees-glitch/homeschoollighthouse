import type { Metadata } from "next";
import { HeritageAdPage } from "@/components/heritage-academy/heritage-ad-page";
import { heritageAcademy } from "@/lib/heritage-academy";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: `${heritageAcademy.programName} High School Track`,
  description: heritageAcademy.shortDescription,
  path: "/heritage-academy",
  image: {
    url: heritageAcademy.flyers.deadlineBell.src,
    alt: heritageAcademy.flyers.deadlineBell.alt,
  },
  keywords: [
    "Heritage Academy",
    "Heritage Foundation",
    "high school",
    "founding principles",
    "public policy",
    "free virtual fellowship",
    "conservative",
    "homeschool",
  ],
});

export default function HeritageAcademyPage() {
  return <HeritageAdPage />;
}
