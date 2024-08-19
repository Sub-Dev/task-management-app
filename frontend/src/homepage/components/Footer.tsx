import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Copyright from '../../Copyright.tsx';
import LogoNoBackground from '../../img/logo-no-background.png';
import { useTheme } from '@mui/material/styles';

const logoStyle = {
  width: '140px',
  height: 'auto',
  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))',
};

export default function Footer() {
  const theme = useTheme();

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
            textAlign: { sm: 'left', xs: 'center' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <img
              src={LogoNoBackground}
              style={logoStyle}
              alt="Logo do TaskMaster"
            />
            <Typography
              variant="h6"
              sx={{ mt: 2 }}
            >
              TaskMaster
            </Typography>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Boletim Informativo
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Inscreva-se em nosso boletim para atualizações semanais e promoções.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="outlined-basic"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="Digite seu endereço de e-mail"
                placeholder="Seu endereço de e-mail"
                inputProps={{
                  autoComplete: 'off',
                  'aria-label': 'Digite seu endereço de e-mail',
                }}
              />
              <Button variant="contained" color="primary" sx={{ flexShrink: 0 }}>
                Inscrever-se
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
            textAlign: { sm: 'left', xs: 'center' },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Produto
          </Typography>
          <Link color="text.secondary" href="#">
            Funcionalidades
          </Link>
          <Link color="text.secondary" href="#">
            Depoimentos
          </Link>
          <Link color="text.secondary" href="#">
            Destaques
          </Link>
          <Link color="text.secondary" href="#">
            Perguntas Frequentes
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
            textAlign: { sm: 'left', xs: 'center' },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Empresa
          </Typography>
          <Link color="text.secondary" href="#">
            Sobre nós
          </Link>
          <Link color="text.secondary" href="#">
            Carreiras
          </Link>
          <Link color="text.secondary" href="#">
            Imprensa
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
            textAlign: { sm: 'left', xs: 'center' },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Legal
          </Typography>
          <Link color="text.secondary" href="#">
            Termos
          </Link>
          <Link color="text.secondary" href="#">
            Privacidade
          </Link>
          <Link color="text.secondary" href="#">
            Contato
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Link color="text.secondary" href="#">
            Política de Privacidade
          </Link>
          <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" href="#">
            Termos de Serviço
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            color: 'text.secondary',
          }}
        >
          <IconButton
            color="inherit"
            href="https://github.com/mui"
            aria-label="GitHub"
            sx={{ alignSelf: 'center', color: theme.palette.mode === 'light' ? '#000' : '#fff' }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.linkedin.com/company/mui/"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center', color: theme.palette.mode === 'light' ? '#000' : '#fff' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
