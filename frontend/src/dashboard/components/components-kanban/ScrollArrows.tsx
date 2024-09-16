import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ScrollArrows = ({ showArrows, scrollLeft, scrollRight, sidebarOpen }) => {
  if (!showArrows) return null;

  return (
    <>
      <IconButton
        onClick={scrollLeft}
        sx={{
          position: 'absolute',
          left: sidebarOpen ? 240 : 80,
          top: '50%',
          transform: 'translateY(-20%)',
          zIndex: 1,
          backgroundColor: '#1976d2',
          borderRadius: '50%',
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
          '&:hover': { backgroundColor: '#115293' },
        }}
      >
        <ArrowBackIosNewIcon sx={{ color: 'white' }} />
      </IconButton>

      <IconButton
        onClick={scrollRight}
        sx={{
          position: 'absolute',
          right: sidebarOpen ? 20 : 20,
          top: '50%',
          transform: 'translateY(-20%)',
          zIndex: 1,
          backgroundColor: '#1976d2',
          borderRadius: '50%',
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
          '&:hover': { backgroundColor: '#115293' },
        }}
      >
        <ArrowForwardIosIcon sx={{ color: 'white' }} />
      </IconButton>
    </>
  );
};

export default ScrollArrows;
