import Link from "next/link";
import { filtersToSearchParams } from "@/lib/directory/query-listings";
import { Button } from "@/components/ui/button";
import type { FilterState } from "@/types/listing";

function pageWindow(page: number, pageCount: number) {
  const pages: (number | "gap")[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, page + 2);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("gap");
  }
  for (let index = start; index <= end; index += 1) pages.push(index);
  if (end < pageCount) {
    if (end < pageCount - 1) pages.push("gap");
    pages.push(pageCount);
  }
  return pages;
}

export function BrowsePagination({
  page,
  pageCount,
  filters,
  basePath,
}: {
  page: number;
  pageCount: number;
  filters: FilterState;
  basePath: string;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (target: number) => {
    const params = filtersToSearchParams(filters);
    params.delete("page");
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = pageWindow(page, pageCount);

  return (
    <nav aria-label="Browse pages" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Page {page.toLocaleString()} of {pageCount.toLocaleString()}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {page <= 1 ? (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page - 1)} rel="prev">
              Previous
            </Link>
          </Button>
        )}
        {pages.map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-sm text-[var(--color-muted-foreground)]">
              …
            </span>
          ) : (
            <Button key={item} asChild variant={item === page ? "default" : "outline"} size="sm">
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
              >
                {item.toLocaleString()}
              </Link>
            </Button>
          ),
        )}
        {page >= pageCount ? (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page + 1)} rel="next">
              Next
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
