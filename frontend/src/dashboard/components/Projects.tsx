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
import { useSnackbar } from '../../context/SnackbarContext.tsx';

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
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    users: '',
  });
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [nameError, setNameError] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

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
      showSnackbar(location.state.error, 'error');
    }
  }, [location.state]);

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

      // Verifique se algo foi alterado no projeto
      let hasChanges = false;
      const updatedFields: any = {};

      if (currentProject) {
        // Verifica se o nome foi alterado
        if (newProject.name.trim() !== currentProject.name.trim()) {
          updatedFields.name = newProject.name.trim();
          hasChanges = true;
        }

        // Verifica se a descrição foi alterada
        const currentDescription = currentProject.description || ''; // Garante que seja uma string
        if (newProject.description.trim() !== currentDescription.trim()) {
          updatedFields.description = newProject.description.trim();
          hasChanges = true;
        }

        // Verifica se os usuários foram alterados
        let currentUsers: string[] = [];

        // Verifica se currentProject.users é uma string de nomes separados por vírgula ou um array de objetos
        if (typeof currentProject.users === 'string') {
          // Se for uma string, converta-a em um array de usuários
          currentUsers = currentProject.users.split(',').map(user => user.trim()).sort();
        } else if (Array.isArray(currentProject.users)) {
          // Se for um array de objetos de usuário, ajuste para pegar os nomes ou IDs
          currentUsers = currentProject.users.map(user => user.name?.trim() || '').sort();
        }

        const newUsers = newProject.users.split(',').map(user => user.trim()).filter(Boolean).sort();

        if (JSON.stringify(currentUsers) !== JSON.stringify(newUsers)) {
          const usernames = newUsers;
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
            userIds = [userId];
          }

          const userIndex = userIds.indexOf(userId);
          if (userIndex !== -1) {
            userIds.splice(userIndex, 1);
          }

          updatedFields.users = [userId, ...userIds];
          hasChanges = true;
        }
      } else {
        // Se for um novo projeto, validar todos os campos
        updatedFields.name = newProject.name.trim();
        updatedFields.description = newProject.description.trim();
        hasChanges = true;

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
          userIds = [userId];
        }

        updatedFields.users = [userId, ...userIds];
      }

      // Se não houve mudanças, apenas feche o modal
      if (!hasChanges) {
        handleCloseModal();
        return;
      }

      // Somente verificar a existência do nome se o nome foi alterado
      if (updatedFields.name) {
        const existingProjectResponse = await axios.get('http://localhost:4000/projects/search', {
          params: { name: updatedFields.name, userId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (existingProjectResponse.data && existingProjectResponse.data.length > 0) {
          showSnackbar('Já existe um projeto com este nome.', 'error');
          setNameError(true);
          return;
        }

        setNameError(false);
      }

      // Definir a URL e o método
      const url = currentProject ? `http://localhost:4000/projects/${currentProject.id}` : 'http://localhost:4000/projects';
      const method = currentProject ? 'put' : 'post';

      // Enviar a requisição com os campos atualizados
      await axios({
        method,
        url,
        data: updatedFields,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSnackbar(currentProject ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!', 'success');

      fetchProjects();
      handleCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showSnackbar('Erro ao salvar o projeto: ' + error.message, 'error');
      } else {
        showSnackbar('Erro inesperado ao salvar o projeto.', 'error');
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
                p: { xs: 2, sm: 3 }, // Adapta o padding para telas menores
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ECF0F1', // Fundo alterado para #ECF0F1
                borderRadius: 2,
                overflow: 'auto', // Garante que o conteúdo não quebre
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#2C3E50', // Texto alterado para #2C3E50
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: { xs: 'h6.fontSize', sm: 'h5.fontSize' }, // Ajusta o tamanho da fonte para diferentes telas
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
                  fontSize: { xs: '0.75rem', sm: '1rem' }, // Ajusta o tamanho da fonte para diferentes telas
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
                    fontSize: { xs: 'body2.fontSize', sm: 'body1.fontSize' }, // Ajusta o tamanho da fonte para diferentes telas
                  }}
                >
                  Você ainda não tem projetos. Crie um novo projeto para começar.
                </Typography>
              ) : (
                <>
                  <Box sx={{ overflowX: 'auto' }}> {/* Adiciona rolagem horizontal se necessário */}
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Data</TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Nome</TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Descrição</TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Participantes</TableCell>
                          <TableCell align="right" sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Número de Tarefas</TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #BDC3C7', color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                          <TableRow key={row.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#F5F5F5' } }}>
                            <TableCell sx={{ color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>{row.created_at}</TableCell>
                            <TableCell sx={{ color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>{row.name}</TableCell>
                            <TableCell sx={{ color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>{row.description}</TableCell>
                            <TableCell sx={{ color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>{row.users}</TableCell>
                            <TableCell align="right" sx={{ color: '#2C3E50', fontSize: { xs: '0.75rem', sm: '1rem' } }}>{row.tasksCount}</TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}> {/* Adicionado espaçamento entre ícones */}
                                <Tooltip title="Editar">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(row)}
                                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Ajusta o tamanho do ícone
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDelete(row.id)}
                                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Ajusta o tamanho do ícone
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Ver Kanban">
                                  <IconButton
                                    color="info"
                                    onClick={() => handleKanban(row.id)}
                                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Ajusta o tamanho do ícone
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
                  </Box>
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
                      backgroundColor: '#ECF0F1',
                      fontSize: { xs: '0.75rem', sm: '1rem' } // Ajusta o tamanho da fonte para diferentes telas
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

              if (e.target.name === 'name' && e.target.value.trim()) {
                setNameError(false);
              }
            }}
            error={nameError}
            helperText={nameError ? 'O nome do projeto é obrigatório.' : ''}
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
    </React.Fragment>
  );
}
