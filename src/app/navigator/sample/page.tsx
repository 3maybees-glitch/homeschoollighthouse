import type { Metadata } from "next";
import { brand } from "@/lib/brand-vocabulary";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { NavigatorSampleReport } from "@/components/navigator/navigator-sample-report";
import { sampleReportMeta } from "@/lib/navigator/sample-report";

export const metadata: Metadata = pageMetadata({
  title: `Sample ${brand.navigator.title} Curriculum Chart`,
  description: sampleReportMeta.subtitle,
  path: "/navigator/sample",
  keywords: ["homeschool curriculum sample", "The Navigator", "multi-year homeschool plan"],
});

export default function NavigatorSamplePage() {
  return <NavigatorSampleReport />;
}
