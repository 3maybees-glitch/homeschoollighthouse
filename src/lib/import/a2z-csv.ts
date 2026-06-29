import type { HomeschoolComCsvRow } from "@/lib/import/homeschool-com-csv";
import { homeschoolComRowToSeedInput } from "@/lib/import/homeschool-com-csv";

export type A2zCsvRow = {
  title: string;
  website_url: string;
  a2z_source_url: string;
  grades_or_ages: string;
  prices_mentioned: string;
  description: string;
};

export function a2zRowToSeedInput(row: A2zCsvRow) {
  const mapped: HomeschoolComCsvRow = {
    title: row.title,
    website_url: row.website_url,
    homeschool_com_url: row.a2z_source_url,
    grades_or_ages: row.grades_or_ages,
    prices_mentioned: row.prices_mentioned,
    description: row.description,
  };
  const seed = homeschoolComRowToSeedInput(mapped);
  return {
    ...seed,
    description: [
      row.description?.trim(),
      row.a2z_source_url ? `Listed on A2Z Homeschooling archive: ${row.a2z_source_url}` : "",
    ]
      .filter(Boolean)
      .join(" "),
    shortDescription:
      row.description?.slice(0, 120) || `Homeschool resource from the A2Z Homeschooling directory.`,
  };
}
