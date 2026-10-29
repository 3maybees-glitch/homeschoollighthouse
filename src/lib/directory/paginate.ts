export const BROWSE_PAGE_SIZE = 24;

export function paginate<T>(items: T[], page: number, pageSize = BROWSE_PAGE_SIZE) {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);
  const requested = Number.isFinite(page) ? Math.floor(page) : 1;
  const safePage = Math.min(Math.max(1, requested), pageCount);
  const startIndex = (safePage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    total,
    page: safePage,
    pageSize,
    pageCount,
    rangeStart: total === 0 ? 0 : startIndex + 1,
    rangeEnd: Math.min(total, startIndex + pageSize),
  };
}
