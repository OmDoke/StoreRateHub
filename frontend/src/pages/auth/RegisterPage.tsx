import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
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
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';

interface RegisterForm {
  name: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address || undefined,
      });
      navigate('/user/stores');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
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
        py: 4,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 480,
          mx: 2,
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
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
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Join StoreRateHub today
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Full Name"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 5, message: 'Name must be at least 5 characters' },
                maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
              }}
            />
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
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              {...register('address', {
                maxLength: { value: 400, message: 'Address cannot exceed 400 characters' },
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                maxLength: { value: 16, message: 'Maximum 16 characters' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-])/,
                  message: 'Must contain 1 uppercase & 1 special character',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5, borderRadius: '12px',
                background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
                fontWeight: 600, fontSize: '1rem', textTransform: 'none',
                boxShadow: '0 8px 24px rgba(233,69,96,0.35)',
                '&:hover': { background: 'linear-gradient(135deg, #d63851, #e94560)' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
