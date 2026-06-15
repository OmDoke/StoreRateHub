import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/storeApi';
import { Store, PaginatedResponse } from '../../types';
import { useSnackbar } from '../../context/SnackbarContext';
import {
  Box, Typography, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination,
  TableSortLabel, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Rating,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const StoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, limit: rowsPerPage, sortBy, sortOrder };
      if (search) params.search = search;
      const response = await storeApi.getAll(params);
      const result = response.data as PaginatedResponse<Store>;
      setStores(result.data);
      setTotal(result.meta.total);
    } catch {
      showError('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortBy, sortOrder, search]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const handleDelete = async () => {
    if (!selectedStore) return;
    try {
      await storeApi.delete(selectedStore.id);
      showSuccess('Store deleted successfully');
      setDeleteDialogOpen(false);
      fetchStores();
    } catch {
      showError('Failed to delete store');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#1a1a2e">Store Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/stores/add')}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #e94560, #ff6b6b)', boxShadow: '0 4px 16px rgba(233,69,96,0.3)', '&:hover': { background: 'linear-gradient(135deg, #d63851, #e94560)' } }}>
          Add Store
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth size="small" placeholder="Search stores..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell><TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? sortOrder : 'asc'} onClick={() => handleSort('name')}>Store Name</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'email'} direction={sortBy === 'email' ? sortOrder : 'asc'} onClick={() => handleSort('email')}>Email</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'address'} direction={sortBy === 'address' ? sortOrder : 'asc'} onClick={() => handleSort('address')}>Address</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'rating'} direction={sortBy === 'rating' ? sortOrder : 'asc'} onClick={() => handleSort('rating')}>Avg Rating</TableSortLabel></TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
                    <TableCell>{store.email}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store.address}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating value={store.averageRating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">({store.averageRating})</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => navigate(`/admin/stores/edit/${store.id}`)} sx={{ color: '#f59e0b' }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => { setSelectedStore(store); setDeleteDialogOpen(true); }} sx={{ color: '#e94560' }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {stores.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No stores found</Typography></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={total} rowsPerPage={rowsPerPage} page={page}
              onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
          </>
        )}
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={600}>Confirm Delete</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete store <strong>{selectedStore?.name}</strong>?</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: '8px', textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoresPage;
