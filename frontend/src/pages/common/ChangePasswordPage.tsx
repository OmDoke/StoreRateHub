import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../api/authApi';
import { useSnackbar } from '../../context/SnackbarContext';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ChangePasswordForm>();
  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);
    try {
      await authApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      showSuccess('Password changed successfully');
      reset();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="#1a1a2e" mb={3}>Change Password</Typography>
      <Card sx={{ borderRadius: '16px', maxWidth: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth label="Current Password"
              type={showCurrent ? 'text' : 'password'}
              {...register('currentPassword', { required: 'Current password is required' })}
              error={!!errors.currentPassword} helperText={errors.currentPassword?.message}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end" size="small">{showCurrent ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment>,
              }}
            />
            <TextField fullWidth label="New Password"
              type={showNew ? 'text' : 'password'}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
                maxLength: { value: 16, message: 'Max 16 characters' },
                pattern: { value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-])/, message: '1 uppercase & 1 special char required' },
              })}
              error={!!errors.newPassword} helperText={errors.newPassword?.message}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowNew(!showNew)} edge="end" size="small">{showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment>,
              }}
            />
            <TextField fullWidth label="Confirm New Password" type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
              sx={{ mb: 3 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
            />
            <Button fullWidth type="submit" variant="contained" disabled={loading}
              sx={{ py: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #e94560, #ff6b6b)', fontWeight: 600, textTransform: 'none',
                '&:hover': { background: 'linear-gradient(135deg, #d63851, #e94560)' } }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePasswordPage;
