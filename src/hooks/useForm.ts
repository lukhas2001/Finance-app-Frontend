import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { TransactionType } from "../interfaces";

// allow the onAdd callback to be either sync or async
type OnAdd = (
  type: TransactionType,
  amount: number,
  title?: string,
  description?: string
) => Promise<void> | void;

/**
 * useForm hook
 * @param initialAmount initial amount as string
 * @param initialType initial transaction type
 * @param onAdd optional callback invoked when submit (handleAdd) succeeds
 */
export function useForm(
  initialAmount = "",
  initialType: TransactionType = "Income",
  onAdd?: OnAdd
) {
  const [transaction, setTransaction] = useState<{
    amount: string;
    type: TransactionType;
    title: string;
    description?: string;
  }>({
    amount: initialAmount,
    type: initialType,
    title: "",
    description: "",
  });

  const reset = () => {
    setTransaction({ amount: "", type: "Income", title: "", description: "" });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement &
      HTMLSelectElement &
      HTMLTextAreaElement;
    setTransaction((prev) => ({ ...prev, [name]: value } as any));
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(transaction.amount);
    if (isNaN(value) || value <= 0) return;
    await onAdd?.(
      transaction.type,
      value,
      transaction.title || undefined,
      transaction.description || undefined
    );
    reset();
  };

  return {
    amount: transaction.amount,
    type: transaction.type,
    title: transaction.title,
    description: transaction.description,
    handleChange,
    handleAdd,
    reset,
    setTransaction,
  } as const;
}
