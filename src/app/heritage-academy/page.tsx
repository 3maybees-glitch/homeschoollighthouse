import type { Metadata } from "next";
import { HeritageAdPage } from "@/components/heritage-academy/heritage-ad-page";
import { heritageAcademy } from "@/lib/heritage-academy";

export const metadata: Metadata = {
  title: `${heritageAcademy.programName} High School Track`,
  description: heritageAcademy.shortDescription,
  openGraph: {
    title: `${heritageAcademy.programName} | Homeschool Lighthouse`,
    description: heritageAcademy.shortDescription,
    type: "website",
    url: "/heritage-academy",
    images: [
      {
        url: heritageAcademy.flyers.deadlineBell.src,
        alt: heritageAcademy.flyers.deadlineBell.alt,
      },
    ],
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
};

export default function HeritageAcademyPage() {
  return <HeritageAdPage />;
}
