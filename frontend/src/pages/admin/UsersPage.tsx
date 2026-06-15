import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { User, PaginatedResponse, Role } from '../../types';
import { useSnackbar } from '../../context/SnackbarContext';
import {
  Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TablePagination, TableSortLabel, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sortOrder,
      };
      if (search) params.search = search;
      if (filterRole) params.role = filterRole;

      const response = await userApi.getAll(params);
      const result = response.data as PaginatedResponse<User>;
      setUsers(result.data);
      setTotal(result.meta.total);
    } catch {
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortBy, sortOrder, search, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await userApi.delete(selectedUser.id);
      showSuccess('User deleted successfully');
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch {
      showError('Failed to delete user');
    }
  };

  const getRoleChip = (role: Role) => {
    const map = {
      [Role.ADMIN]: { color: '#e94560', bg: '#e9456015' },
      [Role.USER]: { color: '#0ea5e9', bg: '#0ea5e915' },
      [Role.STORE_OWNER]: { color: '#22c55e', bg: '#22c55e15' },
    };
    const style = map[role] || { color: '#666', bg: '#66666615' };
    return (
      <Chip
        label={role.replace('_', ' ')}
        size="small"
        sx={{ backgroundColor: style.bg, color: style.color, fontWeight: 600, fontSize: '0.75rem', border: `1px solid ${style.color}30` }}
      />
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} color="#1a1a2e">
          Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/users/add')}
          sx={{
            borderRadius: '10px', textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
            boxShadow: '0 4px 16px rgba(233,69,96,0.3)',
            '&:hover': { background: 'linear-gradient(135deg, #d63851, #e94560)' },
          }}
        >
          Add User
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
                sx={{ borderRadius: '10px' }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
              </Select>
            </FormControl>
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
                  <TableCell><TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? sortOrder : 'asc'} onClick={() => handleSort('name')}>Name</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'email'} direction={sortBy === 'email' ? sortOrder : 'asc'} onClick={() => handleSort('email')}>Email</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'address'} direction={sortBy === 'address' ? sortOrder : 'asc'} onClick={() => handleSort('address')}>Address</TableSortLabel></TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: '#fafbfc' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.address || '-'}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => navigate(`/admin/users/${user.id}`)} sx={{ color: '#0ea5e9' }}><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => navigate(`/admin/users/edit/${user.id}`)} sx={{ color: '#f59e0b' }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => { setSelectedUser(user); setDeleteDialogOpen(true); }} sx={{ color: '#e94560' }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </>
        )}
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={600}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: '8px', textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
