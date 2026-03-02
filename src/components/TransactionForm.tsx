import { useForm } from "../hooks/useForm";
import type { TransactionType } from "../interfaces";

type Props = {
  onAdd?: (
    type: TransactionType,
    amount: number,
    title?: string,
    description?: string
  ) => Promise<void> | void;
  initialAmount?: string;
  initialType?: TransactionType;
};

export const TransactionForm = ({
  onAdd,
  initialAmount = "",
  initialType = "Income",
}: Props) => {
  const { amount, type, title, description, handleChange, handleAdd } = useForm(
    initialAmount,
    initialType,
    onAdd
  );

  return (
    <form
      onSubmit={handleAdd}
      className="container d-flex flex-column gap-2 mb-4"
    >
      <input
        type="text"
        placeholder="Título"
        name="title"
        value={title}
        onChange={handleChange}
        className="form-control"
      />
      <textarea
        placeholder="Descripción (opcional)"
        name="description"
        value={description}
        onChange={handleChange}
        className="form-control"
      />

      <div className="form-row">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto"
          name="amount"
          value={amount}
          onChange={handleChange}
          className="form-control"
          required
        />
        
        <select
          name="type"
          value={type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Income">Ingreso</option>
          <option value="Expense">Gasto</option>
        </select>

        <button type="submit" className="btn btn-primary">
          Agregar
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
