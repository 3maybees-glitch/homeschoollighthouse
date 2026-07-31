import { brand } from "@/lib/brand-vocabulary";
import { NavigatorSampleReport } from "@/components/navigator/navigator-sample-report";
import { sampleReportMeta } from "@/lib/navigator/sample-report";

export const metadata = {
  title: `Sample Report · ${brand.navigator.title}`,
  description: sampleReportMeta.subtitle,
};

export default function NavigatorSamplePage() {
  return <NavigatorSampleReport />;
}
