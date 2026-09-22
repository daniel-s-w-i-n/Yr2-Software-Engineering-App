import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';

const LoadingScreenComponent = () => {
  const navigate = useNavigate();

  return (
   <Grid container sx={{ height: '100vh' }}>
  {/* Left Side Content */}
  <Grid item xs={12} md={6} sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer'
  }} onClick={() => navigate('/login')}>
    <Box textAlign="center" sx={{ marginTop: '-50px' }}> {/* Adjusted margin */}
      <img 
        src="./eviden-logo.png" 
        alt="Eviden Logo" 
        style={{ width: '500px', height: '155px' }} // Adjusted size
      />
      <Typography variant="h4" sx={{ mt: '-30px', fontWeight: 'bold', fontFamily: 'Lato, sans-serif' }}> {/* Adjusted margin and typography */}
        Expanding Possibilities across
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Lato, sans-serif' }}> {/* Adjusted typography */}
        Data & Technology
      </Typography>
    </Box>
  </Grid>
      
      {/* Right Side Map Background with Gradient */}
      <Grid item xs={12} md={6} sx={{
        display: 'flex',
        background: `linear-gradient(to left, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 100%), url('./map-image.png')`,
        backgroundPosition: 'center',
        backgroundSize: 'auto 100%', 
        backgroundRepeat: 'no-repeat',
        height: '100vh',        
        }}>
      </Grid>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          backgroundColor: '#013035',
          color: 'white',
          textAlign: 'center',
          padding: '15px 0',
          position: 'absolute',
          bottom: 0,
        }}
      >
        <Typography>
          © 2024 Ecomute - All rights reserved - Team 39
        </Typography>
      </Box>
    </Grid>
  );
};

export default LoadingScreenComponent;
