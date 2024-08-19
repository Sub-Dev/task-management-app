// src/context/SnackbarContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarContextType {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  handleClose: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ open, message, severity, showSnackbar, handleClose }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posiciona o Snackbar no canto superior direito
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: (theme) => theme.palette[severity].main // Define a cor do Snackbar com base na severidade
          }
        }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
