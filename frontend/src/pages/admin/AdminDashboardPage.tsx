import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { AdminDashboard } from '../../types';
import {
  Box, Grid, Card, CardContent, Typography, CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#e94560', '#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6'];

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardApi.getAdminDashboard();
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;

  const statCards = [
    { title: 'Total Users', value: data.totalUsers, icon: <PeopleIcon />, gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', shadow: 'rgba(14,165,233,0.3)' },
    { title: 'Total Stores', value: data.totalStores, icon: <StoreIcon />, gradient: 'linear-gradient(135deg, #22c55e, #4ade80)', shadow: 'rgba(34,197,94,0.3)' },
    { title: 'Total Ratings', value: data.totalRatings, icon: <StarIcon />, gradient: 'linear-gradient(135deg, #e94560, #ff6b6b)', shadow: 'rgba(233,69,96,0.3)' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="#1a1a2e" mb={3}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 4 }} key={card.title}>
            <Card
              sx={{
                borderRadius: '16px',
                background: card.gradient,
                boxShadow: `0 8px 32px ${card.shadow}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${card.shadow}` },
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56, height: 56, borderRadius: '14px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2} color="#1a1a2e">
                Ratings Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.ratingsDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="rating" tick={{ fill: '#666' }} />
                  <YAxis tick={{ fill: '#666' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#e94560" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2} color="#1a1a2e">
                Users By Role
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.usersByRole}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="role"
                    label={({ role, count }) => `${role}: ${count}`}
                  >
                    {data.usersByRole.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
