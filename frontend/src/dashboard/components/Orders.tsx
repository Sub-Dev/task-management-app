import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
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
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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

export default function Orders() {
  const [rows, setRows] = useState<ProjectData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    users: '',
  });
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
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

      const usernames = newProject.users.split(',').map(user => user.trim());

      const usersResponse = await axios.get('http://localhost:4000/users/search', {
        params: { username: usernames.join(',') },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Extrair IDs de usuários e garantir que não há duplicatas
      const userIds = Array.from(new Set([
        ...usersResponse.data.map((user: any) => user.id),
        userId, // Adiciona o ID do usuário logado
      ]));

      const url = currentProject ? `http://localhost:4000/projects/${currentProject.id}` : 'http://localhost:4000/projects';
      const method = currentProject ? 'put' : 'post';

      console.log(`URL da requisição: ${url}`);
      console.log(`Dados enviados:`, {
        name: newProject.name,
        description: newProject.description,
        users: userIds,
      });

      await axios({
        method,
        url,
        data: {
          name: newProject.name,
          description: newProject.description,
          users: userIds,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProjects(); // Atualiza a lista de projetos após salvar
      handleCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao salvar o projeto:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      } else {
        console.error('Erro inesperado:', error);
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

      fetchProjects(); // Atualiza a lista de projetos após exclusão
    } catch (error) {
      console.error('Erro ao excluir o projeto:', error);
    }
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
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              Projetos
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={handleAddProject}
              >
                Adicionar Projeto
              </Button>
              {rows.length === 0 ? (
                <p>Você ainda não tem projetos. Crie um novo projeto para começar.</p>
              ) : (
                <>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Participantes</TableCell>
                        <TableCell align="right">Número de Tarefas</TableCell>
                        <TableCell>Actions</TableCell> {/* Adicionado para ações */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.created_at}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.users}</TableCell>
                          <TableCell align="right">{row.tasksCount}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <IconButton onClick={() => handleEdit(row)} color="primary">
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(row.id)} sx={{ color: 'red', ml: 1 }}>
                                <DeleteIcon />
                              </IconButton>
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
                  />
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Adicionar Novo Projeto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome do Projeto"
            type="text"
            fullWidth
            variant="standard"
            value={newProject.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
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
          <Button onClick={handleSaveProject}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Editar Projeto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome do Projeto"
            type="text"
            fullWidth
            variant="standard"
            value={newProject.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
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
          <Button onClick={handleSaveProject}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
