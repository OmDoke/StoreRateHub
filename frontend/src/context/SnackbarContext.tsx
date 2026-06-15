import React, { useState, createContext, useContext, ReactNode } from 'react';

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' };
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSuccess = (message: string) => setSnackbar({ open: true, message, severity: 'success' });
  const showError = (message: string) => setSnackbar({ open: true, message, severity: 'error' });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, snackbar, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
