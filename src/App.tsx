import "./App.css";
import TransactionForm from "./components/TransactionForm";
import { useTransactions } from "./hooks/useTransactions";
import { formatCurrencyARS } from "./helpers/format";
import TransactionPaginator from "./components/TransactionPaginator";
import { useState } from "react";
import { useForm } from "./hooks/useForm";
import Notification from "./ui/Notification";
// types are imported where needed; keep imports minimal in this file

function App() {
  const {
    transactions,
    addTransaction,
    total,
    removeTransaction,
    updateTransaction,
    // setPage and loading are available on the hook but not needed here
    page,
    goToPage,
  } = useTransactions();

  // server-side paged items
  const pageItems = transactions.data ?? [];
  const currentPage = transactions.currentPage ?? page;
  const totalPages = transactions.totalPages ?? 1;

  const [editingId, setEditingId] = useState<string | null>(null);
  const editForm = useForm();

  // Handlers defined once and passed by reference to JSX (avoid inline functions)
  const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    const t = pageItems.find((transaction) => transaction.id === id);
    if (!t) return;
    setEditingId(id);
    editForm.setTransaction({
      amount: String(t.amount),
      type: t.type,
      title: t.title ?? "",
      description: t.description ?? "",
    });
  };

  const handleDeleteButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    await removeTransaction(id);
  };

  const handleEditorSave = async (id: string, updated: any) => {
    await updateTransaction(id, updated);
    setEditingId(null);
  };

  const handleEditorCancel = () => setEditingId(null);

  const handleEditorDelete = async (id: string) => {
    await removeTransaction(id);
    setEditingId(null);
  };

  const [openNotify, setOpenNotify] = useState(false);
  
  return (
    <div className="finance-app">
      {openNotify && (
        <Notification
          text="Guardado correctamente"
          open={openNotify}
        />
      )}

      <h2 style={{ textAlign: "center" }}>Finanzas Personales</h2>
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Total:{" "}
        <span style={{ color: total >= 0 ? "green" : "red" }}>
          {formatCurrencyARS(total)}
        </span>
      </div>

      <TransactionForm onAdd={addTransaction} />

      <div>
        <h4 style={{ display: "flex", justifyContent: "center" }}>Historial</h4>
        <ul className="transactions-list">
          {pageItems.length === 0 && (
            <li style={{ color: "#888" }}>Sin movimientos</li>
          )}

          <TransactionPaginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            editForm={editForm}
            editingId={editingId}
            handleEditButtonClick={handleEditButtonClick}
            handleDeleteButtonClick={handleDeleteButtonClick}
            handleEditorSave={handleEditorSave}
            handleEditorCancel={handleEditorCancel}
            handleEditorDelete={handleEditorDelete}
            pageItems={pageItems}
            setOpenNotify={setOpenNotify}
          />
        </ul>
      </div>
    </div>
  );
}

export default App;
