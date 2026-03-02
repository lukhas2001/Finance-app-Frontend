import React, { useState } from "react";
import type { Transaction, TransactionType } from "../interfaces";
import {
  CheckOutlined,
  ClearOutlined,
  DeleteOutlineOutlined,
  DescriptionOutlined,
} from "@mui/icons-material";
import { TextField } from "@mui/material";
import Popup from "../ui/Popup";

type Props = {
  transaction: Transaction;
  values: {
    title: string;
    description?: string;
    amount: string;
    type: TransactionType;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onSave: (
    id: string,
    updated: {
      type: TransactionType;
      amount: number;
      title?: string;
      description?: string;
    }
  ) => Promise<void> | void;
  onCancel: () => void;
  onDelete: (id: string) => Promise<void> | void;
  setOpenNotify: (open: boolean) => void;
};

export const TransactionEditor = ({
  transaction,
  values,
  handleChange,
  onSave,
  onCancel,
  onDelete,
  setOpenNotify,
}: Props) => {
  const handleSave = async () => {
    if (!transaction.id) return;
    const parsed = parseFloat(values.amount);

    if (isNaN(parsed) || parsed <= 0) return;
    await onSave(transaction.id, {
      type: values.type,
      amount: parsed,
      title: values.title || undefined,
      description: values.description || undefined,
    });
    setOpenNotify(true);
    setTimeout(() => {
      setOpenNotify(false);
    }, 3000);
  };

  const handleDelete = async () => {
    if (!transaction.id) return;
    await onDelete(transaction.id);
  };

  const [toggle, setToggle] = useState(false);

  return (
    <div className="d-flex gap-2">
      <button className="btn btn-primary" onClick={() => setToggle(!toggle)}>
        <DescriptionOutlined
          titleAccess={toggle ? "Ocultar descripcion" : "Editar descripcion"}
        />
      </button>

      {toggle ? (
        <Popup
          toggleState={toggle}
          onToggle={setToggle}
          onCancel={onCancel}
          setOpenNotify={setOpenNotify}
        >
          <TextField
            className="form-control"
            sx={{
              width: {
                xs: "400px",
                sm: "500px",
                md: "600px",
              },
            }}
            name="description"
            multiline
            rows={8}
            fullWidth
            placeholder="Descripcion..."
            value={values.description}
            onChange={handleChange}
          />
        </Popup>
      ) : (
        <>
          <input
            className="form-control"
            name="title"
            value={values.title}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="number"
            name="amount"
            value={values.amount}
            onChange={handleChange}
          />
          <select
            className="form-select"
            name="type"
            value={values.type}
            onChange={handleChange}
          >
            <option value="Income">Ingreso</option>
            <option value="Expense">Gasto</option>
          </select>
        </>
      )}

      <button className="btn btn-primary" onClick={handleSave}>
        <CheckOutlined titleAccess="Guardar transaccion" />
      </button>

      <button className="btn btn-secondary" onClick={onCancel}>
        <ClearOutlined titleAccess="Cancelar edición" />
      </button>

      <button className="btn btn-danger" onClick={handleDelete}>
        <DeleteOutlineOutlined titleAccess="Eliminar transaccion" />
      </button>
    </div>
  );
};

export default TransactionEditor;
