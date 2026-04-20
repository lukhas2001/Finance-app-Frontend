import { useEffect, useMemo, useState } from "react";
import type {
  TransactionType,
  TransactionBody,
  PagedTransactions,
} from "../interfaces";
import {
  createTransaction,
  getTransactionsPaged,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
} from "../helpers/api";

export function useTransactions(initialPageProp?: number) {
  const initialPage = (() => {
    const queryParam = new URLSearchParams(window.location.search).get("page");
    const numberPage = Number(queryParam ?? initialPageProp ?? 1);
    return Number.isInteger(numberPage) && numberPage > 0 ? numberPage : 1;
  })();

  const [totalGlobal, setTotalGlobal] = useState<number>(0);

  const [page, setPage] = useState(initialPage);
  const [transactions, setTransactions] = useState<PagedTransactions>({
    data: [],
    currentPage: page,
    totalPages: 1,
    totalItems: 0,
    totalAmount: 0,
    totalDifference: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch page from server using the page state
        const data = await getTransactionsPaged(page);
        if (!mounted) return;
        if (data) {
          setTransactions(data);
          // Sincronizar totalGlobal con el totalAmount devuelto por el backend
          const anyData = data as any;
          if (typeof anyData.totalDifference === "number") {
            setTotalGlobal(anyData.totalDifference);
          }
        }
        // sync the page into the query string so refresh/bookmark keeps it
        const url = new URL(window.location.href);
        url.searchParams.set("page", String(page));
        window.history.replaceState({}, "", url.toString());
      } catch (err) {
        setError((err as Error)?.message ?? "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [page]);

  const addTransaction = async (
    type: TransactionType,
    amount: number,
    title?: string,
    description?: string
  ) => {
    // post to backend
    const body = { type, amount, title, description } as const;
    const transactionCreated = await createTransaction(body);
    if (!transactionCreated) {
      setError("No se pudo crear la transacción");
      return;
    }
    // actualizamos pagina localmente
    setTransactions((prev) => ({
      ...prev,
      data: [...prev.data, transactionCreated],
      totalItems: (prev.totalItems ?? 0) + 1,
    }));
    //actualizamos total global al instante
    setTotalGlobal((prev) =>
      transactionCreated.type === "Income"
        ? prev + transactionCreated.amount
        : prev - transactionCreated.amount
    );
  };

  const removeTransaction = async (id: string) => {
    //encontrar la transaccion para actualizar total global
    const toRemove = transactions.data.find(
      (transaction) => transaction.id === id
    );
    if (toRemove) {
      setTotalGlobal((prev) =>
        toRemove.type === "Income"
          ? prev - toRemove.amount
          : prev + toRemove.amount
      );
    }

    try {
      await apiDeleteTransaction(id);
    } catch (err) {
      console.error("deleteTransaction error", err);
    }

    setTransactions((prev) => ({
      ...prev,
      data: prev.data.filter((transaction) => transaction.id !== id),
      totalItems: Math.max(0, (prev.totalItems ?? 1) - 1),
    }));
  };

  const updateTransaction = async (
    id: string,
    updated: Partial<TransactionBody>
  ) => {
    try {
      const res = await apiUpdateTransaction(id, updated);

      //encontrar el elemento anterior para ajustar el total
      const prevItem = transactions.data.find((transaction) => transaction.id === id);
      if (prevItem) {
        const prevValue = prevItem.type === "Income" ? prevItem.amount : -prevItem.amount;
        const newValue = (updated.type === "Income" ? (updated.amount ?? 0) : -(updated.amount ?? 0));
        setTotalGlobal((prev)=> prev - prevValue + newValue);
      }
      setTransactions((prev) => ({
        ...prev,
        data: prev.data.map((transaction) =>
          transaction.id === id
            ? { ...transaction, ...(res ?? updated) }
            : transaction
        ),
      }));
    } catch (err) {
      console.error("updateTransaction error", err);
    }
  };

  const clear = () =>
    setTransactions(() => ({
      data: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      totalAmount: 0,
      totalDifference: 0,
    }));

  const total = useMemo(() => totalGlobal, [totalGlobal]);

  const goToPage = (page: number) => {
    const next = Math.max(1, Math.min(page, transactions.totalPages || 1));
    setPage(next);
  };

  return {
    transactions,
    addTransaction,
    removeTransaction,
    clear,
    total,
    loading,
    error,
    updateTransaction,
    page,
    goToPage,
    setPage,
  } as const;
}
