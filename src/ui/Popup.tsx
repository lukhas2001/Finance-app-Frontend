import { Check, Clear } from "@mui/icons-material";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import type React from "react";

type Props = {
  children: React.ReactNode;
  toggleState: boolean;
  onToggle: (open: boolean) => void;
  onCancel?: () => void;
  setOpenNotify: (open: boolean) => void;
};

const Popup = ({
  children,
  toggleState,
  onToggle,
  onCancel,
  setOpenNotify,
}: Props) => {
  return (
    <>
      <Dialog open={toggleState} onClose={onCancel}>
        <DialogTitle>Editar la descripcion:</DialogTitle>
        {children}
        <DialogActions>
          <button
            className="btn btn-primary"
            onClick={() => {
              onToggle(false);
              setOpenNotify(true);
              setTimeout(() => {
                setOpenNotify(false);
              }, 3000);
            }}
          >
            <Check titleAccess="Listo"></Check>
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            <Clear titleAccess="Cancelar"></Clear>
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Popup;
