import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      switch (user.role) {
        case Role.ADMIN:
          navigate('/admin/dashboard');
          break;
        case Role.USER:
          navigate('/user/stores');
          break;
        case Role.STORE_OWNER:
          navigate('/owner/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating orbs */}
      <Box sx={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)',
        top: -100, right: -50, animation: 'pulse 4s ease-in-out infinite',
      }} />
      <Box sx={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
        bottom: -50, left: -30, animation: 'pulse 5s ease-in-out infinite 1s',
      }} />

      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          mx: 2,
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: '16px',
                background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 2, boxShadow: '0 8px 24px rgba(233,69,96,0.35)',
              }}
            >
              <StarIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="#1a1a2e">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Sign in to StoreRateHub
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgba(0,0,0,0.3)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgba(0,0,0,0.3)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(233,69,96,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d63851, #e94560)',
                  boxShadow: '0 12px 32px rgba(233,69,96,0.45)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default LoginPage;
