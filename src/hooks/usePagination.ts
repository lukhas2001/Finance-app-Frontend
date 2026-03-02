import { useEffect, useMemo, useState } from "react";

const usePagination = <T>(items: T[], pageSize = 5, initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  useEffect(() => {
    if (currentPage > totalPages || currentPage < 1) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const goTo = (page: number) => setCurrentPage(Math.min(Math.max(1, page), totalPages));
  const next = () => goTo(currentPage + 1);
  const prev = () => goTo(currentPage - 1);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    pageItems,
    goTo,
    next,
    prev,
  };
};

export default usePagination;
