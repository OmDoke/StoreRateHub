import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 800, background: 'linear-gradient(135deg, #e94560, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1, fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
        sx={{
          borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 4, py: 1.2,
          background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
          '&:hover': { background: 'linear-gradient(135deg, #d63851, #e94560)' },
        }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
