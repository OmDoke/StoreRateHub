import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';

const DRAWER_WIDTH = 260;

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case Role.ADMIN:
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
          { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
          { text: 'Stores', icon: <StoreIcon />, path: '/admin/stores' },
        ];
      case Role.USER:
        return [
          { text: 'Stores', icon: <StoreIcon />, path: '/user/stores' },
          { text: 'Change Password', icon: <LockIcon />, path: '/user/change-password' },
        ];
      case Role.STORE_OWNER:
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/owner/dashboard' },
          { text: 'Change Password', icon: <LockIcon />, path: '/owner/change-password' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#e0e0e0',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <StarIcon sx={{ color: '#fff', fontSize: 28 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          StoreRateHub
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ px: 1.5, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? 'rgba(233, 69, 96, 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(233, 69, 96, 0.2)' : 'rgba(255,255,255,0.06)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#e94560' : 'rgba(255,255,255,0.5)',
                    minWidth: 40,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: 2,
                      background: 'linear-gradient(180deg, #e94560, #ff6b6b)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
