import type {
  TransactionBody,
  PagedTransactions,
  Transaction,
} from "../interfaces";

// url backend
const API_URL_Paged = "http://localhost:5009/api/transactions/paged";
const API_URL = "http://localhost:5009/api/transactions";

//GET function
export const getTransasctions = async (): Promise<Transaction[] | null> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener las transacciones");
    }
    return (await response.json()) as Transaction[];
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return null;
  }
};

//GET paged function
export const getTransactionsPaged = async (
  page?: number,
  pageSize?: number
): Promise<PagedTransactions | null> => {
  try {
    const url = new URL(API_URL_Paged);
    if (page !== undefined) url.searchParams.append("page", page.toString());
    if (pageSize !== undefined)
      url.searchParams.append("pageSize", pageSize.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Error al obtener las transacciones");
    }
    return (await response.json()) as PagedTransactions;
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return null;
  }
};

//POST function
export const createTransaction = async (transaction: TransactionBody) => {
  try {
    console.log("Creating transaction", transaction);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Error al crear la transacción");
    }
    return await response.json();
  } catch (err) {
    console.error("createTransaction error", err);
    return null;
  }
};

//PUT function
export const updateTransaction = async (
  id: string,
  transaction: Partial<TransactionBody>
) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar la transacción");
    }
    return await response.json();
  } catch (err) {
    console.error("updateTransaction error", err);
    return null;
  }
};

// DELETE function
export const deleteTransaction = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar la transacción");
    }
    // return await response.json();
  } catch (error) {
    console.error("deleteTransaction error", error);
    return null;
  }
};
