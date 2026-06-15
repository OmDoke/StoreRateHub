import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { Role } from './types';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Layout
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import UserFormPage from './pages/admin/UserFormPage';
import UserDetailsPage from './pages/admin/UserDetailsPage';
import StoresPage from './pages/admin/StoresPage';
import StoreFormPage from './pages/admin/StoreFormPage';

// User Pages
import UserStoresPage from './pages/user/UserStoresPage';

// Owner Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';

// Common Pages
import ChangePasswordPage from './pages/common/ChangePasswordPage';
import NotFoundPage from './pages/common/NotFoundPage';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  palette: {
    primary: {
      main: '#e94560',
    },
    background: {
      default: '#f5f5f9',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'medium' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none' as const,
          fontWeight: 600,
        },
      },
    },
  },
});

const HomeRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case Role.ADMIN: return <Navigate to="/admin/dashboard" />;
    case Role.USER: return <Navigate to="/user/stores" />;
    case Role.STORE_OWNER: return <Navigate to="/owner/dashboard" />;
    default: return <Navigate to="/login" />;
  }
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <SnackbarProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Home Redirect */}
              <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><RoleRoute roles={[Role.ADMIN]}><MainLayout /></RoleRoute></ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="users/add" element={<UserFormPage />} />
                <Route path="users/edit/:id" element={<UserFormPage />} />
                <Route path="users/:id" element={<UserDetailsPage />} />
                <Route path="stores" element={<StoresPage />} />
                <Route path="stores/add" element={<StoreFormPage />} />
                <Route path="stores/edit/:id" element={<StoreFormPage />} />
              </Route>

              {/* Normal User Routes */}
              <Route path="/user" element={<ProtectedRoute><RoleRoute roles={[Role.USER]}><MainLayout /></RoleRoute></ProtectedRoute>}>
                <Route path="stores" element={<UserStoresPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
              </Route>

              {/* Store Owner Routes */}
              <Route path="/owner" element={<ProtectedRoute><RoleRoute roles={[Role.STORE_OWNER]}><MainLayout /></RoleRoute></ProtectedRoute>}>
                <Route path="dashboard" element={<OwnerDashboardPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </SnackbarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
