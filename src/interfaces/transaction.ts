export type TransactionType = 'Income' | 'Expense';

export interface PagedTransactions {
  data: Transaction[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  totalAmount: number;
  totalDifference: number;
}

export type TransactionBody = {
  type: TransactionType;
  amount: number;
  title?: string;
  description?: string;
};

export interface Transaction {
  id?: string; // GUID generado por el backend
  title?: string;
  description?: string;
  amount: number;
  type: TransactionType;
}
