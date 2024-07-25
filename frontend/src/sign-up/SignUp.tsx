import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from '@mui/material'; // Importação simplificada do MUI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoNoBackground from '../img/logo-no-background.png';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import Copyright from '../Copyright.tsx';

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

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstName = data.get('firstName')?.toString() ?? '';
    const lastName = data.get('lastName')?.toString() ?? '';
    const username = `${firstName} ${lastName}`.trim(); // Adicione um `trim` para remover espaços desnecessários
    const email = data.get('email')?.toString() ?? '';
    const password = data.get('password')?.toString() ?? '';
    console.log("Nome de usuário:", username);

    try {
      await axiosInstance.post('/auth/register', { username, email, password });
      navigate('/signin');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);

      if (error.response) {
        // Erro de resposta (servidor respondeu com um status diferente de 2xx)
        const statusCode = error.response.status;

        if (statusCode === 400) {
          setError('Verifique os dados enviados. Alguma informação pode estar incorreta.');
        } else if (statusCode === 500) {
          setError('Erro interno no servidor. Tente novamente mais tarde.');
        } else {
          setError(`Erro inesperado: ${statusCode}. Por favor, tente novamente.`);
        }
      } else if (error.request) {
        // Erro de requisição (a requisição foi feita mas não houve resposta)
        setError('Sem resposta do servidor. Por favor, verifique sua conexão de internet.');
      } else {
        // Outro erro
        setError('Erro ao realizar cadastro. Por favor, tente novamente.');
      } if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        setError('O nome de usuário contém caracteres inválidos.');
        return;
      }

    }
  };

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
            <img src={LogoNoBackground} alt="Logo" style={{ width: 100, height: 100 }} />
            <Typography component="h1" variant="h5" sx={{ color: theme.palette.text.primary, mt: 2 }}>
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
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
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                    sx={{ color: theme.palette.text.primary }}
                  />
                </Grid>
              </Grid>
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
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2" sx={{ color: theme.palette.text.primary }}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4, color: theme.palette.text.primary }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
