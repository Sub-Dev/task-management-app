import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Box,
  Container
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { styled } from '@mui/system';

const Input = styled('input')({
  display: 'none',
});

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao.silva@example.com',
    password: '',
    confirmPassword: '',
    profileImage: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Implemente a lógica de salvamento (API call, validação, etc.)
    console.log('Dados do usuário salvos:', user);
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
                  src={user.profileImage || '/path/to/default/avatar.jpg'}
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
                  label="Senha"
                  name="password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={user.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirmar Senha"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={user.confirmPassword}
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
    </Container>
  );
};

export default UserProfile;
