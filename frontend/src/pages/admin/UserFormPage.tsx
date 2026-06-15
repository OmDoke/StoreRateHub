import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { userApi } from '../../api/userApi';
import { useSnackbar } from '../../context/SnackbarContext';
import { Role } from '../../types';
import {
  Box, Card, CardContent, Typography, TextField, Button, MenuItem,
  CircularProgress, InputAdornment, Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  role: Role;
}

const UserFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserFormData>();

  useEffect(() => {
    if (isEdit && id) {
      const fetchUser = async () => {
        try {
          const response = await userApi.getOne(id);
          const user = response.data;
          reset({ name: user.name, email: user.email, address: user.address || '', role: user.role, password: '' });
        } catch {
          showError('Failed to fetch user');
          navigate('/admin/users');
        } finally {
          setFetching(false);
        }
      };
      fetchUser();
    }
  }, [id, isEdit]);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      if (isEdit) {
        const payload: any = { name: data.name, email: data.email, address: data.address, role: data.role };
        if (data.password) payload.password = data.password;
        await userApi.update(id!, payload);
        showSuccess('User updated successfully');
      } else {
        await userApi.create(data);
        showSuccess('User created successfully');
      }
      navigate('/admin/users');
    } catch (err: any) {
      showError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/users')} sx={{ mb: 2, textTransform: 'none', color: '#666' }}>
        Back to Users
      </Button>
      <Typography variant="h4" fontWeight={700} color="#1a1a2e" mb={3}>
        {isEdit ? 'Edit User' : 'Add User'}
      </Typography>
      <Card sx={{ borderRadius: '16px', maxWidth: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid size={12}>
                <TextField fullWidth label="Full Name"
                  {...register('name', { required: 'Name is required', minLength: { value: 20, message: 'Min 20 characters' }, maxLength: { value: 60, message: 'Max 60 characters' } })}
                  error={!!errors.name} helperText={errors.name?.message}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
                />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Email" type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  error={!!errors.email} helperText={errors.email?.message}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
                />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label={isEdit ? 'Password (leave blank to keep)' : 'Password'}
                  type="password"
                  {...register('password', {
                    ...(!isEdit && { required: 'Password is required' }),
                    minLength: { value: 8, message: 'Min 8 characters' },
                    maxLength: { value: 16, message: 'Max 16 characters' },
                    pattern: { value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-])/, message: '1 uppercase & 1 special char required' },
                  })}
                  error={!!errors.password} helperText={errors.password?.message}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
                />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Address" multiline rows={2}
                  {...register('address', { maxLength: { value: 400, message: 'Max 400 characters' } })}
                  error={!!errors.address} helperText={errors.address?.message}
                  InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="role"
                  control={control}
                  defaultValue={Role.USER}
                  rules={{ required: 'Role is required' }}
                  render={({ field }) => (
                    <TextField select fullWidth label="Role" {...field} error={!!errors.role} helperText={errors.role?.message}>
                      <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                      <MenuItem value={Role.USER}>Normal User</MenuItem>
                      <MenuItem value={Role.STORE_OWNER}>Store Owner</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Button fullWidth type="submit" variant="contained" disabled={loading}
                  sx={{ py: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #e94560, #ff6b6b)', fontWeight: 600, textTransform: 'none',
                    '&:hover': { background: 'linear-gradient(135deg, #d63851, #e94560)' } }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : isEdit ? 'Update User' : 'Create User'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserFormPage;
