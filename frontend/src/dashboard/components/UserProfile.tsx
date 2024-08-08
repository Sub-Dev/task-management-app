import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from '../../axiosInstance';
import { jwtDecode } from 'jwt-decode'; // Correção da importação
import defaultAvatar from '../../img/avatar/1.png'; // Imagem padrão importada

const Input = styled('input')({
  display: 'none',
});

interface UserPayload {
  sub: number;
  email: string;
}

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '', // Mantido como 'password' internamente
    profileImage: ''
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: UserPayload = jwtDecode(token);
          const userId = decoded.sub;

          if (userId) {
            setUserId(userId);

            const response = await axios.get(`/users/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            const { username, email, profileImageUrl } = response.data;
            setUser({
              name: username || '',
              email: email || '',
              profileImage: profileImageUrl || '',
              password: '' // Inicializa o campo de senha como vazio
            });
          } else {
            console.error('User ID is undefined');
          }
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // Verifica se o arquivo é maior que 5MB
        setSnackbarMessage('Arquivo de imagem deve ter no máximo 5MB');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prevUser => ({ ...prevUser, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', user.name);
      formData.append('email', user.email);
      if (user.password) {
        formData.append('password', user.password); // Envia o campo 'password'
      }

      if (user.profileImage && user.profileImage.startsWith('data:')) {
        const response = await fetch(user.profileImage);
        const blob = await response.blob();
        formData.append('profileImage', blob, 'profile.jpg');
      } else if (user.profileImage) {
        formData.append('profileImageUrl', user.profileImage);
      }

      const token = localStorage.getItem('token');

      if (userId !== null) {
        await axios.put(`/users/${userId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setSnackbarMessage('Dados do usuário salvos com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        console.log('User data saved');
      } else {
        console.error('User ID is not available');
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
      setSnackbarMessage('Erro ao salvar dados do usuário');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
              Editar Perfil
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={user.profileImage || defaultAvatar} // Usa a imagem padrão importada
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center">
                <label htmlFor="upload-profile-image">
                  <Input
                    accept="image/*"
                    id="upload-profile-image"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nome"
                  name="name"
                  fullWidth
                  variant="outlined"
                  value={user.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={user.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nova Senha"
                  name="password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={user.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
                >
                  Salvar Alterações
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Reposiciona o Snackbar
        sx={{ width: '100%' }} // Torna o Snackbar um pouco maior
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;
