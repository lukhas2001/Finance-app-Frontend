import { Alert, Snackbar } from "@mui/material";

type Props = {
  text: string;
  open: boolean;
};

const Notification = ({ text, open }: Props) => {
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notification;
