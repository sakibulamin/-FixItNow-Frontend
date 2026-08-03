import { useMemo, useState } from "react";

/**
 * Paginates an already-fetched array on the client. Used because the
 * confirmed backend endpoints (GET /services, GET /technicians) don't
 * expose page/limit query params — see implementation plan gap #7.
 */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  }

  function resetPage() {
    setPage(1);
  }

  return {
    page: safePage,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
  };
}
