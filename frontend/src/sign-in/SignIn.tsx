import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../Copyright.tsx';
import LogoNoBackground from '../img/logo-no-background.png';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { useSnackbar } from '../context/SnackbarContext.tsx';

const theme = createTheme({
  palette: {
    background: {
      default: '#1b222a',
    },
    text: {
      primary: '#ffffff',
    },
    primary: {
      main: '#ffffff',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#ffffff',
        },
      },
    },
  },
});

export default function SignIn() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      console.log('Dados salvos encontrados:', { savedEmail, savedPassword });
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  React.useEffect(() => {
    if (!loading && user) {
      console.log('Usuário logado, redirecionando para /dashboard:', user);
      navigate('/dashboard');
    } else {
      console.log('Nenhum usuário logado ou ainda carregando:', { user, loading });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Tentativa de login com:', { email, password });

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { access_token } = response.data;

      if (access_token) {
        console.log('Login bem-sucedido, token recebido:', access_token);
        localStorage.setItem('token', access_token);

        if (rememberMe) {
          console.log('Salvando dados de login no localStorage');
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } else {
          console.log('Removendo dados de login do localStorage');
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
        window.location.reload();
        navigate('/dashboard');
      } else {
        showSnackbar('Token não encontrado na resposta', 'error');
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      showSnackbar('Erro ao fazer login. Verifique suas credenciais e tente novamente.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1b222a 0%, #2c3e50 100%)',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, boxShadow: 3, p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={LogoNoBackground} alt="Logo" style={{ width: 150, height: 150 }} />
            <Typography component="h1" variant="h5" sx={{ color: theme.palette.text.primary, mt: 2 }}>
              Entrar
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Endereço de email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Lembre de mim"
                sx={{ color: theme.palette.text.primary }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#1b222a',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  },
                }}
              >
                Entrar
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/signup" variant="body2" sx={{ color: theme.palette.text.primary }}>
                    {"Não tem uma conta? Registre"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
