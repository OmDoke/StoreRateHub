import React, { useEffect, useState, useCallback } from 'react';
import { storeApi } from '../../api/storeApi';
import { ratingApi } from '../../api/ratingApi';
import type { Store, PaginatedResponse } from '../../types';
import { useSnackbar } from '../../context/SnackbarContext';
import {
  Box, Typography, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, TableSortLabel, CircularProgress,
  Rating, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import StarIcon from '@mui/icons-material/Star';

const UserStoresPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);

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

  const handleRateStore = (store: Store) => {
    setSelectedStore(store);
    setRatingValue(store.userRating || 0);
    setRatingDialogOpen(true);
  };

  const submitRating = async () => {
    if (!selectedStore || !ratingValue) return;
    setSubmitting(true);
    try {
      if (selectedStore.userRating) {
        // Find existing rating ID by fetching store ratings
        const ratingsResponse = await ratingApi.getByStore(selectedStore.id);
        const existingRating = ratingsResponse.data.ratings?.find(
          (r: any) => r.userId === JSON.parse(localStorage.getItem('user') || '{}').id
        );
        if (existingRating) {
          await ratingApi.update(existingRating.id, { rating: ratingValue });
          showSuccess('Rating updated successfully');
        }
      } else {
        await ratingApi.create({ storeId: selectedStore.id, rating: ratingValue });
        showSuccess('Rating submitted successfully');
      }
      setRatingDialogOpen(false);
      fetchStores();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="#1a1a2e" mb={3}>Stores</Typography>

      <Paper sx={{ p: 2, mb: 3, borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth size="small" placeholder="Search by name or address..." value={search}
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
                  <TableCell><TableSortLabel active={sortBy === 'address'} direction={sortBy === 'address' ? sortOrder : 'asc'} onClick={() => handleSort('address')}>Address</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'rating'} direction={sortBy === 'rating' ? sortOrder : 'asc'} onClick={() => handleSort('rating')}>Overall Rating</TableSortLabel></TableCell>
                  <TableCell>My Rating</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store.address}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating value={store.averageRating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">({store.averageRating})</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {store.userRating ? (
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                          <Typography fontWeight={600}>{store.userRating}</Typography>
                        </Box>
                      ) : (
                        <Typography color="text.secondary" variant="body2">Not rated</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant={store.userRating ? 'outlined' : 'contained'}
                        onClick={() => handleRateStore(store)}
                        sx={{
                          borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
                          ...(store.userRating ? {
                            borderColor: '#f59e0b', color: '#f59e0b',
                            '&:hover': { borderColor: '#d97706', backgroundColor: '#f59e0b10' },
                          } : {
                            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                            '&:hover': { background: 'linear-gradient(135deg, #d97706, #f59e0b)' },
                          }),
                        }}
                      >
                        {store.userRating ? 'Update Rating' : 'Rate Store'}
                      </Button>
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

      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle fontWeight={600}>
          {selectedStore?.userRating ? 'Update Rating' : 'Rate Store'}
        </DialogTitle>
        <DialogContent>
          <Typography mb={2}>How would you rate <strong>{selectedStore?.name}</strong>?</Typography>
          <Box display="flex" justifyContent="center">
            <Rating
              value={ratingValue}
              onChange={(_, newValue) => setRatingValue(newValue)}
              size="large"
              sx={{ fontSize: '3rem' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRatingDialogOpen(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={submitRating} variant="contained" disabled={!ratingValue || submitting}
            sx={{ borderRadius: '8px', textTransform: 'none', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', '&:hover': { background: 'linear-gradient(135deg, #d97706, #f59e0b)' } }}>
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserStoresPage;
