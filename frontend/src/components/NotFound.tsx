import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../img/background-image.jpg';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleGoHome = () => {
    navigate('/'); // Vai para a página inicial
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'fixed', // Fixa o componente na tela
        top: 0,
        left: 0,
        zIndex: 9999, // Garante que o componente esteja na frente de outros
      }}
    >
      <Container
        component="main"
        maxWidth="md"
        sx={{
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
          Oops! Página não encontrada.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          A página que você está procurando pode ter sido removida, teve seu nome alterado, ou está temporariamente indisponível.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleGoBack}>
            Voltar
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: '#757575',
              borderColor: '#757575',
              '&:hover': {
                backgroundColor: '#e0e0e0',
                borderColor: '#757575',
              },
            }}
            onClick={handleGoHome}
          >
            Página Inicial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
