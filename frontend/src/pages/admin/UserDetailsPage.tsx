import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { User, Role } from '../../types';
import {
  Box, Card, CardContent, Typography, CircularProgress, Chip, Grid, Button, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';

const UserDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getOne(id!);
        setUser(response.data);
      } catch {
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  if (!user) return null;

  const getRoleBadge = (role: Role) => {
    const map = {
      [Role.ADMIN]: { label: 'Admin', color: '#e94560' },
      [Role.USER]: { label: 'Normal User', color: '#0ea5e9' },
      [Role.STORE_OWNER]: { label: 'Store Owner', color: '#22c55e' },
    };
    const style = map[role] || { label: role, color: '#666' };
    return <Chip label={style.label} sx={{ backgroundColor: `${style.color}15`, color: style.color, fontWeight: 600, border: `1px solid ${style.color}30` }} />;
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/users')} sx={{ mb: 2, textTransform: 'none', color: '#666' }}>
        Back to Users
      </Button>
      <Typography variant="h4" fontWeight={700} color="#1a1a2e" mb={3}>User Details</Typography>
      <Card sx={{ borderRadius: '16px', maxWidth: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box sx={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg, #e94560, #ff6b6b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>{user.name.charAt(0)}</Typography>
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
              {getRoleBadge(user.role)}
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <EmailIcon sx={{ color: '#0ea5e9' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography fontWeight={500}>{user.email}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <HomeIcon sx={{ color: '#22c55e' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography fontWeight={500}>{user.address || 'Not provided'}</Typography>
                </Box>
              </Box>
            </Grid>
            {user.store && (
              <Grid size={12}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <StarIcon sx={{ color: '#f59e0b' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Store Average Rating</Typography>
                    <Typography fontWeight={500}>
                      {user.store.name} — {user.store.averageRating != null ? `${user.store.averageRating} / 5` : 'No ratings yet'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailsPage;
