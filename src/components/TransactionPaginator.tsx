import { formatCurrencyARS } from "../helpers/format";
import type { Transaction } from "../interfaces";
import TransactionEditor from "./TransactionEditor";
import { EditOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

type Props = {
  // editar/eliminar transacciones
  editForm: any;
  editingId: string | null;
  handleEditButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDeleteButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleEditorSave: (id: string, updated: any) => Promise<void>;
  handleEditorCancel: () => void;
  handleEditorDelete: (id: string) => Promise<void>;
  // paginación (server-side)
  currentPage: number;
  totalPages: number;
  pageItems: Transaction[];
  onPageChange: (page: number) => void;
  setOpenNotify: (open: boolean) => void;
};

const TransactionPaginator = ({
  currentPage,
  totalPages,
  pageItems,
  editForm,
  editingId,
  handleEditButtonClick,
  handleDeleteButtonClick,
  handleEditorSave,
  handleEditorCancel,
  handleEditorDelete,
  onPageChange,
  setOpenNotify,
}: Props) => {
  const pages = Array.from(
    { length: Math.max(1, totalPages) },
    (_, i) => i + 1
  );

  return (
    <>
      <ul className="list-group">
        {pageItems.map((transaction, idx) => (
          <li
            key={transaction.id ?? idx}
            className="list-group-item"
            style={{
              borderLeft:
                transaction.type === "Income" ? "solid green" : "solid red",
            }}
          >
            {editingId === transaction.id ? (
              <TransactionEditor
                transaction={transaction}
                values={{
                  title: editForm.title,
                  description: editForm.description ?? "",
                  amount: editForm.amount,
                  type: editForm.type,
                }}
                handleChange={editForm.handleChange}
                onSave={handleEditorSave}
                onCancel={handleEditorCancel}
                onDelete={handleEditorDelete}
                setOpenNotify={setOpenNotify}
              />
            ) : (
              <>
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <h6 className="fw-bold">{transaction.title ?? transaction.type}</h6>
                  {transaction.description && <p>{transaction.description}</p>}

                  <p>{formatCurrencyARS(transaction.amount)}</p>
                </div>

                <div className="d-flex justify-content-center align-items-center gap-5">
                  <button
                    className="btn btn-primary"
                    data-id={transaction.id}
                    onClick={handleEditButtonClick}
                  >
                    <EditOutlined titleAccess="Editar transaccion" />
                  </button>

                  <button
                    className="btn btn-danger"
                    data-id={transaction.id}
                    onClick={handleDeleteButtonClick}
                  >
                    <DeleteOutlineOutlined titleAccess="Eliminar transaccion" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className="page-item">
            <button
              className={`page-link ${currentPage <= 1 ? "disabled" : ""}`}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              Anterior
            </button>
          </li>

          {pages.map((page) => (
            <li key={page} className="page-item">
              <button
                className={`page-link ${page === currentPage ? "active" : ""}`}
                onClick={() => onPageChange(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            </li>
          ))}

          <li className="page-item">
            <button
              className={`page-link ${
                currentPage >= totalPages ? "disabled" : ""
              }`}
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default TransactionPaginator;
