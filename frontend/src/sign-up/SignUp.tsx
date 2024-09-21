import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoNoBackground from '../img/logo-no-background.png';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import Copyright from '../Copyright.tsx';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from '../context/SnackbarContext.tsx';
import { calculateStrength, PasswordStrengthMeter } from '../components/PasswordStrength.tsx';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showStrengthMeter, setShowStrengthMeter] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const { showSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'password') {
      setFormData(prevData => ({ ...prevData, password: value }));
      setShowStrengthMeter(true);
      setPasswordStrength(calculateStrength(value));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { firstName: '', lastName: '', email: '', password: '' };

    if (!formData.firstName) {
      errors.firstName = 'O primeiro nome é obrigatório.';
      isValid = false;
    }
    if (!formData.lastName) {
      errors.lastName = 'O sobrenome é obrigatório.';
      isValid = false;
    }
    if (!formData.email) {
      errors.email = 'O email é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido.';
      isValid = false;
    }
    if (!formData.password) {
      errors.password = 'A senha é obrigatória.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const username = `${formData.firstName} ${formData.lastName}`;


    const dataToSend = {
      username,
      email: formData.email,
      password: formData.password,
    };

    try {
      await axiosInstance.post('/auth/register', dataToSend);
      showSnackbar('Cadastro realizado com sucesso! Redirecionando para login...', 'success');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);

      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 409) {
          showSnackbar('Nome de usuário ou email já estão em uso.', 'error');
        } else if (statusCode === 400) {
          showSnackbar('Verifique os dados enviados. Alguma informação pode estar incorreta.', 'error');
        } else if (statusCode === 500) {
          showSnackbar('Erro interno no servidor. Tente novamente mais tarde.', 'error');
        } else {
          showSnackbar(`Erro inesperado: ${statusCode}. Por favor, tente novamente.`, 'error');
        }
      } else if (error.request) {
        showSnackbar('Sem resposta do servidor. Por favor, verifique sua conexão de internet.', 'error');
      } else {
        showSnackbar('Erro ao realizar cadastro. Por favor, tente novamente.', 'error');
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
              Registrar
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="Nome"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
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
                    label="Sobrenome"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
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
                    label="Endereço de email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
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
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                  {showStrengthMeter && (
                    <Box width="100%">
                      <PasswordStrengthMeter passwordStrength={passwordStrength} />
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Inscrever-se
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item mb={2}>
                  <Button onClick={() => navigate('/signin')} variant="text" sx={{ color: '#ffffff', textTransform: 'none', }}>
                    Já tem uma conta? Entrar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ color: theme.palette.text.primary }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
