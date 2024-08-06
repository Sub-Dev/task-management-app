import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import Logo from '../img/logo-no-background.png';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        position: 'fixed', // Mantenha o componente fixo na tela
        top: 0,
        left: 0,
        width: '100vw', // Use largura total da tela
        height: '100vh', // Use altura total da tela
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1b222a', // Cor de fundo
        zIndex: 9999, // Certifique-se de que o spinner esteja acima de outros conteúdos
      }}
    >
      <img src={Logo} alt="Logo" style={{ width: 300, height: 300, marginBottom: 20 }} />
      <CircularProgress color="primary" />
      <Typography variant="h6" sx={{ color: '#ffffff', mt: 2 }}>
        Carregando...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
