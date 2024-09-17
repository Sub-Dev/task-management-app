// src/dashboard/components/Projects.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'; // Importar o Tooltip
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface ProjectData {
  id: number;
  created_at: string;
  name: string;
  description: string;
  users: string;
  tasksCount: number;
}

interface UserPayload {
  sub: number;
  email: string;
}

function truncateText(text: string, maxWords: number): string {
  const words = text.split(' ');
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

function createData(
  id: number,
  created_at: string,
  name: string,
  description: string,
  users: string,
  tasksCount: number
): ProjectData {
  const truncatedDescription = truncateText(description, 10);
  return { id, created_at, name, description: truncatedDescription, users, tasksCount };
}

export default function Projects() {
  const [rows, setRows] = useState<ProjectData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('error');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    users: '',
  });
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [nameError, setNameError] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Erro: Token JWT não encontrado.');
        navigate('/signin');
        return;
      }

      const decoded = jwtDecode<UserPayload>(token);
      const userId = decoded.sub;

      const response = await axios.get('http://localhost:4000/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const projectsData = response.data;

      const filteredProjects = projectsData.filter((project: any) =>
        project.users.some((user: any) => user.id === userId)
      );

      const formattedProjects = filteredProjects.map((project: any) => {
        const usernames = project.users.map((user: any) => user.username).join(', ');

        return createData(
          project.id,
          new Date(project.created_at).toLocaleDateString(),
          project.name,
          project.description,
          usernames,
          project.tasks.length
        );
      });

      setRows(formattedProjects);
    } catch (error) {
      console.error('Erro ao buscar dados do backend:', error);
      if (error.response && error.response.status === 401) {
        navigate('/signin');
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    if (location.state?.error) {
      setSnackbarMessage(location.state.error);
      setSnackbarOpen(true);
    }
  }, [location.state]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProject = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditModalOpen(false);
    setNewProject({ name: '', description: '', users: '' });
    setCurrentProject(null);
  };

  const handleSaveProject = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Erro: Token JWT não encontrado.');
        return;
      }

      const decoded = jwtDecode<UserPayload>(token);
      const userId = decoded.sub;

      if (!newProject.name.trim()) {
        setSnackbarMessage('O nome do projeto é obrigatório.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setNameError(true);  // Destaca o campo de nome do projeto com erro
        return;
      }

      setNameError(false);  // Remove o destaque de erro caso o nome esteja preenchido

      // Verifica se já existe um projeto com o mesmo nome
      const existingProjectResponse = await axios.get('http://localhost:4000/projects/search', {
        params: { name: newProject.name.trim(), userId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (existingProjectResponse.data && existingProjectResponse.data.length > 0) {
        setSnackbarMessage('Já existe um projeto com este nome.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setNameError(true);  // Destaca o campo de nome do projeto com erro
        return;
      }

      setNameError(false);  // Remove o destaque de erro caso o nome esteja válido

      const usernames = newProject.users.split(',').map(user => user.trim()).filter(Boolean);

      let userIds: number[] = [];

      if (usernames.length > 0) {
        const usersResponse = await axios.get('http://localhost:4000/users/search', {
          params: { username: usernames.join(',') },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        userIds = Array.from(new Set([
          ...usersResponse.data.map((user: any) => user.id),
          userId,
        ]));
      } else {
        userIds = [userId]; // Apenas o usuário logado
      }

      // Remover o próprio usuário se ele estiver na lista de usernames digitados
      const userIndex = userIds.indexOf(userId);
      if (userIndex !== -1) {
        userIds.splice(userIndex, 1);
      }

      const url = currentProject ? `http://localhost:4000/projects/${currentProject.id}` : 'http://localhost:4000/projects';
      const method = currentProject ? 'put' : 'post';

      await axios({
        method,
        url,
        data: {
          name: newProject.name,
          description: newProject.description,
          users: [userId, ...userIds], // Certifique-se de que o usuário logado sempre esteja presente
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage(currentProject ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      fetchProjects();
      handleCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSnackbarMessage('Erro ao salvar o projeto: ' + error.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Erro inesperado ao salvar o projeto.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };




  const handleEdit = (project: ProjectData) => {
    setCurrentProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      users: project.users,
    });
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Erro: Token JWT não encontrado.');
        return;
      }

      await axios.delete(`http://localhost:4000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProjects();
    } catch (error) {
      console.error('Erro ao excluir o projeto:', error);
    }
  };

  const handleKanban = (id: number) => {
    navigate(`/dashboard/kanban/${id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ECF0F1', // Fundo alterado para #ECF0F1
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#2C3E50', // Texto alterado para #2C3E50
                  mb: 2,
                  fontWeight: 'bold',
                }}
              >
                Projetos
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
                onClick={handleAddProject}
              >
                Adicionar Projeto
              </Button>
              {rows.length === 0 ? (
                <Typography
                  sx={{
                    color: '#2C3E50', // Texto alterado para #2C3E50
                    textAlign: 'center',
                    mt: 2,
                  }}
                >
                  Você ainda não tem projetos. Crie um novo projeto para começar.
                </Typography>
              ) : (
                <>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50' }}>Data</TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50' }}>Nome</TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50' }}>Descrição</TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50' }}>Participantes</TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50' }}>Número de Tarefas</TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50' }}>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#F5F5F5' } }}>
                          <TableCell sx={{ color: '#2C3E50' }}>{row.created_at}</TableCell>
                          <TableCell sx={{ color: '#2C3E50' }}>{row.name}</TableCell>
                          <TableCell sx={{ color: '#2C3E50' }}>{row.description}</TableCell>
                          <TableCell sx={{ color: '#2C3E50' }}>{row.users}</TableCell>
                          <TableCell align="right" sx={{ color: '#2C3E50' }}>{row.tasksCount}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Tooltip title="Editar">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEdit(row)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Ver Kanban">
                                <IconButton
                                  color="info"
                                  onClick={() => handleKanban(row.id)}
                                >
                                  <ViewKanbanIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      '& .MuiTablePagination-selectLabel': { color: '#2C3E50' },
                      '& .MuiTablePagination-select': { color: '#2C3E50' },
                      '& .MuiTablePagination-displayedRows': { color: '#2C3E50' },
                      '& .MuiTablePagination-selectIcon': { color: '#2C3E50' },
                      '& .MuiPaginationItem-root': { color: '#2C3E50' },
                      '& .MuiPaginationItem-icon': { color: '#3498DB' },
                      backgroundColor: '#ECF0F1'
                    }}
                  />
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>


      {/* Modal de Adicionar/Editar Projeto */}
      <Dialog open={openModal || editModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{currentProject ? 'Editar Projeto' : 'Adicionar Projeto'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome do Projeto *"
            type="text"
            fullWidth
            variant="standard"
            value={newProject.name}
            onChange={(e) => {
              handleChange(e);
              setNameError(false); // Limpa o erro quando o usuário começa a digitar
            }}
            error={nameError} // Define se o campo deve ser destacado como erro
            helperText={nameError ? 'O nome do projeto é obrigatório.' : ''} // Mensagem de erro opcional
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            variant="standard"
            value={newProject.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="users"
            label="Participantes (separados por vírgula)"
            type="text"
            fullWidth
            variant="standard"
            value={newProject.users}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSaveProject}>{currentProject ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
