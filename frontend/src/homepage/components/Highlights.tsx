import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import WebRoundedIcon from '@mui/icons-material/WebRounded';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import DeveloperModeRoundedIcon from '@mui/icons-material/DeveloperModeRounded';
import { useInView } from 'react-intersection-observer';

const items = [
  {
    icon: <CodeRoundedIcon />,
    title: 'Desenvolvimento Frontend',
    description:
      'Utilizei React.js para criar uma interface de usuário dinâmica e responsiva, visando uma experiência de usuário fluida e interativa.',
  },
  {
    icon: <WebRoundedIcon />,
    title: 'Desenvolvimento Backend',
    description:
      'Implementei NestJS para construir uma API robusta e escalável, garantindo uma base sólida para a lógica de negócios e manipulação de dados.',
  },
  {
    icon: <DataObjectRoundedIcon />,
    title: 'Armazenamento de Dados',
    description:
      'Escolhi PostgreSQL para armazenamento eficiente e confiável de dados, assegurando uma gestão eficaz e recuperação de informações.',
  },
  {
    icon: <DeveloperModeRoundedIcon />,
    title: 'Conteinerização com Docker',
    description:
      'Utilizei Docker para facilitar a implantação contínua e a gestão de ambientes de desenvolvimento e produção, otimizando o fluxo de trabalho.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: '#1b222a',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" sx={{ fontWeight: 'bold' }}>
            Destaques do Projeto
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400', mt: 1 }}>
            Este aplicativo fullstack é uma demonstração do meu progresso em tecnologias modernas de desenvolvimento web, incluindo React.js, NestJS, PostgreSQL e Docker. Explore como essas tecnologias são aplicadas para criar uma solução eficaz e escalável.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <GridAnimation>
                <Stack
                  direction="column"
                  color="inherit"
                  component={Card}
                  spacing={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.800',
                    backgroundColor: 'grey.900',
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.5s ease, box-shadow 0.5s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ opacity: '70%', mb: 1 }}>{item.icon}</Box>
                  <Typography fontWeight="medium" variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </Stack>
              </GridAnimation>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function GridAnimation({ children }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}
    >
      {children}
    </Box>
  );
}
