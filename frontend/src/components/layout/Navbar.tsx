import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Role } from '../../types';

const DRAWER_WIDTH = 260;

const getRoleBadge = (role: Role) => {
  const map = {
    [Role.ADMIN]: { label: 'Admin', color: '#e94560' as const },
    [Role.USER]: { label: 'User', color: '#0ea5e9' as const },
    [Role.STORE_OWNER]: { label: 'Store Owner', color: '#22c55e' as const },
  };
  return map[role] || { label: role, color: '#666' as const };
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {roleBadge && (
            <Chip
              label={roleBadge.label}
              size="small"
              sx={{
                backgroundColor: `${roleBadge.color}15`,
                color: roleBadge.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                border: `1px solid ${roleBadge.color}30`,
              }}
            />
          )}
          <IconButton onClick={handleMenu} size="small">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.06)',
                minWidth: 180,
              },
            }}
          >
            <MenuItem sx={{ gap: 1.5, py: 1.2 }} disabled>
              <PersonIcon fontSize="small" />
              <Box>
                <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2, color: '#e94560' }}>
              <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
