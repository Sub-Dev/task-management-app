import React, { useEffect, useState } from 'react';
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
import { Password, PhotoCamera } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from '../../axiosInstance';
import { jwtDecode } from 'jwt-decode'; // Correção da importação
import defaultAvatar from '../../img/avatar/1.png'; // Imagem padrão importada
import { useUser } from '../../context/UserContext.tsx'; // Importar o contexto
import { useSnackbar } from '../../context/SnackbarContext.tsx';

const Input = styled('input')({
  display: 'none',
});

interface UserPayload {
  sub: number;
  email: string;
}

interface UserProfileProps {
  open: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ open }) => {
  const { user, setUser } = useUser(); // Usar o contexto
  const [userId, setUserId] = useState<number | null>(null);
  const { showSnackbar } = useSnackbar();
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    handleResize(); // Verifica no carregamento inicial
    window.addEventListener('resize', handleResize); // Adiciona o listener para redimensionamento da tela

    return () => {
      window.removeEventListener('resize', handleResize); // Limpa o listener ao desmontar
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isMobile && open) {
        return;
      }

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
            const fetchedUser = {
              id: userId,
              name: username || '',
              email: email || '',
              password: '',
              profileImage: profileImageUrl || ''
            };

            setUser(fetchedUser); // Atualizar o contexto com os dados do usuário
            setTempProfileImage(profileImageUrl || ''); // Inicializa a imagem temporária
            setTempName(username || ''); // Inicializa o nome temporário
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
  }, [open, isMobile, setUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setTempName(value); // Atualiza o nome temporário
    } else {
      setUser(prevUser => ({ ...prevUser, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // Verifica se o arquivo é maior que 5MB
        showSnackbar('Arquivo de imagem deve ter no máximo 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileImage(reader.result as string); // Atualiza a imagem temporária
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', tempName); // Usa o nome temporário
      formData.append('email', user?.email || '');
      if (user?.password) {
        formData.append('password', user.password); // Envia o campo 'password'
      }

      if (tempProfileImage && tempProfileImage.startsWith('data:')) {
        const response = await fetch(tempProfileImage);
        const blob = await response.blob();
        formData.append('profileImage', blob, 'profile.jpg');
      } else if (tempProfileImage) {
        formData.append('profileImageUrl', tempProfileImage);
      }

      const token = localStorage.getItem('token');

      if (userId !== null) {
        await axios.put(`/users/${userId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        // Atualizar o contexto imediatamente
        setUser(prevUser => ({
          ...prevUser,
          name: tempName, // Atualiza o nome no contexto
          profileImage: tempProfileImage || defaultAvatar
        }));

        showSnackbar('Dados do usuário salvos com sucesso!', 'success');
        console.log('User data saved');
      } else {
        console.error('User ID is not available');
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
      showSnackbar('Erro ao salvar dados do usuário', 'error');
    }
  };

  if (isMobile && open) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ECF0F1',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: '#2C3E50', mb: 2 }}
            >
              Editar Perfil
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={tempProfileImage || defaultAvatar} // Usa a imagem temporária
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
                  value={tempName}
                  onChange={handleInputChange}
                  required
                  sx={{
                    input: { color: '#2C3E50' },
                    label: { color: '#2C3E50' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#2C3E50' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={user?.email || ''}
                  onChange={handleInputChange}
                  required
                  sx={{
                    input: { color: '#2C3E50' },
                    label: { color: '#2C3E50' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#2C3E50' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nova Senha"
                  name="password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  onChange={handleInputChange}
                  sx={{
                    input: { color: '#2C3E50' },
                    label: { color: '#2C3E50' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#2C3E50' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSave}
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
