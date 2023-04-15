import React, { useState } from "react";
import Button from "@mui/material/Button";
import { TextField, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid version 1
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import InputLabel from "@mui/material/InputLabel";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fontSize } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import DescriptionIcon from "@mui/icons-material/Description";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TwitterIcon from "@mui/icons-material/Twitter";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import "typeface-roboto";

function PrivacyPolicy() {
  //   const [privacyDialog, setPrivacyDialog] = useState(false);
  let [privacyDialog, SetPrivacyDialog] = useState(false);

  interface PrivacyStyles {
    container: React.CSSProperties;
  }

  const styles: PrivacyStyles = {
    container: {
      display: "flex",
      flexWrap: "wrap",
      padding: "10px",
    },
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const handleClickDialog = () => {
    SetPrivacyDialog(true);
  };
  const handleCloseDialog = () => {
    SetPrivacyDialog(false);
  };

  interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }

  function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }
  return (
    <div style={styles.container}>
      <a onClick={handleClickDialog}>- Privacy -</a>
      <BootstrapDialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={privacyDialog}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseDialog}
        >
          Privacy Policy
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <h4>Collection of Information</h4>
          <Typography gutterBottom paddingTop={1} paddingBottom={1}>
            This app does not collect any personal data from users, and the only
            information that is processed is the resume and job description data
            submitted through our app. This data is processed in memory while
            the app is in use and is not persisted anywhere.
          </Typography>
          <h4>Use of Information</h4>
          <Typography gutterBottom paddingTop={1} paddingBottom={1}>
            This app uses the resume and job description data submitted by users
            solely for the purpose of generating a customized cover letter for
            the user. It does not share this information with any third parties
            and does not use it for any other purposes.
          </Typography>
          <h4>Protection of Information</h4>
          <Typography gutterBottom paddingTop={1} paddingBottom={1}>
            Reasonable measures are taken to protect the data submitted by
            users. This app processes the data in memory and does not persist it
            anywhere, ensuring that it is not accessible to unauthorized
            parties.
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}

export default PrivacyPolicy;
