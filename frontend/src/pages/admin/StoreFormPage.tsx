import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { storeApi } from '../../api/storeApi';
import { userApi } from '../../api/userApi';
import { useSnackbar } from '../../context/SnackbarContext';
import { User, Role } from '../../types';
import {
  Box, Card, CardContent, Typography, TextField, Button, MenuItem,
  CircularProgress, InputAdornment, Grid,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface StoreFormData {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

const StoreFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [storeOwners, setStoreOwners] = useState<User[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StoreFormData>();

  useEffect(() => {
    // Fetch store owners for the dropdown
    const fetchOwners = async () => {
      try {
        const response = await userApi.getAll({ role: Role.STORE_OWNER, limit: 100 });
        setStoreOwners(response.data.data);
      } catch {
        showError('Failed to fetch store owners');
      }
    };
    fetchOwners();

    if (isEdit && id) {
      const fetchStore = async () => {
        try {
          const response = await storeApi.getOne(id);
          const store = response.data;
          reset({ name: store.name, email: store.email, address: store.address, ownerId: store.ownerId });
        } catch {
          showError('Failed to fetch store');
          navigate('/admin/stores');
        } finally {
          setFetching(false);
        }
      };
      fetchStore();
    }
  }, [id, isEdit]);

  const onSubmit = async (data: StoreFormData) => {
    setLoading(true);
    try {
      if (isEdit) {
        const { ownerId, ...updateData } = data;
        await storeApi.update(id!, updateData);
        showSuccess('Store updated successfully');
      } else {
        await storeApi.create(data);
        showSuccess('Store created successfully');
      }
      navigate('/admin/stores');
    } catch (err: any) {
      showError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} store`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/stores')} sx={{ mb: 2, textTransform: 'none', color: '#666' }}>
        Back to Stores
      </Button>
      <Typography variant="h4" fontWeight={700} color="#1a1a2e" mb={3}>
        {isEdit ? 'Edit Store' : 'Add Store'}
      </Typography>
      <Card sx={{ borderRadius: '16px', maxWidth: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid size={12}>
                <TextField fullWidth label="Store Name"
                  {...register('name', { required: 'Store name is required' })}
                  error={!!errors.name} helperText={errors.name?.message}
                  InputProps={{ startAdornment: <InputAdornment position="start"><StoreIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
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
                <TextField fullWidth label="Address" multiline rows={2}
                  {...register('address', { required: 'Address is required', maxLength: { value: 400, message: 'Max 400 characters' } })}
                  error={!!errors.address} helperText={errors.address?.message}
                  InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
                />
              </Grid>
              {!isEdit && (
                <Grid size={12}>
                  <TextField select fullWidth label="Store Owner"
                    {...register('ownerId', { required: 'Owner is required' })}
                    error={!!errors.ownerId} helperText={errors.ownerId?.message}
                    defaultValue=""
                  >
                    <MenuItem value="" disabled>Select an owner</MenuItem>
                    {storeOwners.map((owner) => (
                      <MenuItem key={owner.id} value={owner.id}>{owner.name} ({owner.email})</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              <Grid size={12}>
                <Button fullWidth type="submit" variant="contained" disabled={loading}
                  sx={{ py: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #e94560, #ff6b6b)', fontWeight: 600, textTransform: 'none',
                    '&:hover': { background: 'linear-gradient(135deg, #d63851, #e94560)' } }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : isEdit ? 'Update Store' : 'Create Store'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StoreFormPage;
