import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import type { StoreOwnerDashboard } from '../../types';
import {
  Box, Card, CardContent, Typography, CircularProgress, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Rating,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';

const OwnerDashboardPage: React.FC = () => {
  const [data, setData] = useState<StoreOwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardApi.getStoreOwnerDashboard();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  if (!data || !data.store) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="text.secondary" variant="h6">No store assigned to your account.</Typography>
      </Box>
    );
  }

  const statCards = [
    { title: 'Store Name', value: data.store.name, icon: <StoreIcon />, gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', shadow: 'rgba(14,165,233,0.3)' },
    { title: 'Average Rating', value: `${data.averageRating} / 5`, icon: <StarIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', shadow: 'rgba(245,158,11,0.3)' },
    { title: 'Total Ratings', value: data.totalRatings, icon: <PeopleIcon />, gradient: 'linear-gradient(135deg, #22c55e, #4ade80)', shadow: 'rgba(34,197,94,0.3)' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="#1a1a2e" mb={3}>Store Owner Dashboard</Typography>

      <Grid container spacing={3} mb={4}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 4 }} key={card.title}>
            <Card sx={{
              borderRadius: '16px', background: card.gradient,
              boxShadow: `0 8px 32px ${card.shadow}`,
              transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' },
            }}>
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, mb: 0.5 }}>{card.title}</Typography>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>{card.value}</Typography>
                </Box>
                <Box sx={{ width: 56, height: 56, borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>Store Information</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}><Typography variant="caption" color="text.secondary">Email</Typography><Typography fontWeight={500}>{data.store.email}</Typography></Grid>
            <Grid size={{ xs: 12, sm: 8 }}><Typography variant="caption" color="text.secondary">Address</Typography><Typography fontWeight={500}>{data.store.address}</Typography></Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={600} mb={2}>User Ratings</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600 }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Submitted Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.ratings.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{r.userName}</TableCell>
                <TableCell>{r.userEmail}</TableCell>
                <TableCell><Rating value={r.rating} readOnly size="small" /></TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
              </TableRow>
            ))}
            {data.ratings.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No ratings yet</Typography></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OwnerDashboardPage;
