import React, { useEffect } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title.tsx';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Define um tipo para os dados do projeto
interface ProjectData {
  id: number;
  date: string;
  name: string;
  description: string;
  users: string;
  tasksCount: number;
}

// Função para truncar a descrição
function truncateText(text: string, maxWords: number): string {
  const words = text.split(' ');
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

// Função para criar dados do projeto
function createData(
  id: number,
  date: string,
  name: string,
  description: string,
  users: string,
  tasksCount: number
): ProjectData {
  const truncatedDescription = truncateText(description, 10);
  return { id, date, name, description: truncatedDescription, users, tasksCount };
}

// Component Principal
export default function Orders() {
  const [rows, setRows] = React.useState<ProjectData[]>([]); // Use o tipo ProjectData
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState(false);
  const [newProject, setNewProject] = React.useState({
    name: '',
    description: '',
    users: '',
  });

  const navigate = useNavigate();

  // Função para buscar dados do backend
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token'); // Recupera o token JWT do localStorage

      // Verifica se o token existe
      if (!token) {
        console.error('Erro: Token JWT não encontrado.');
        return;
      }

      const response = await axios.get('http://localhost:4000/projects', {
        headers: {
          Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho da requisição
        }
      });

      const projectsData = response.data;

      // Transforme os dados recebidos para o formato desejado
      const formattedProjects = projectsData.map((project: any) => // Use 'any' se o tipo do backend não for conhecido
        createData(
          project.id,
          new Date(project.date).toLocaleDateString(), // Formata a data para string
          project.name,
          project.description,
          project.users.join(', '), // Converte array de usuários em string
          project.tasksCount
        )
      );

      setRows(formattedProjects);
    } catch (error) {
      console.error('Erro ao buscar dados do backend:', error);
      // Se o erro for 401, redirecione para a página de login
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  // useEffect para buscar dados quando o componente monta
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
  };

  const handleSaveProject = () => {
    const newProjectData: ProjectData = createData(
      rows.length + 1, // Garantir que o id seja único
      new Date().toLocaleDateString(),
      newProject.name,
      newProject.description,
      newProject.users,
      0 // Você pode ajustar isso conforme necessário
    );
    setRows([...rows, newProjectData]);
    setNewProject({ name: '', description: '', users: '' });
    handleCloseModal();
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
              <Title>Projetos</Title>
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={handleAddProject}
              >
                Adicionar Projeto
              </Button>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Participantes</TableCell>
                    <TableCell align="right">Número de Tarefas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/kanban/${row.id}`}
                          color="primary"
                          underline="hover"
                        >
                          {row.name}
                        </Link>
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.users}</TableCell>
                      <TableCell align="right">{row.tasksCount}</TableCell>
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
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Modal para adicionar projeto */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Adicionar Novo Projeto
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Nome do Projeto"
                type="text"
                fullWidth
                variant="outlined"
                value={newProject.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Descrição"
                type="text"
                fullWidth
                variant="outlined"
                value={newProject.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="users"
                label="Participantes (separados por vírgula)"
                type="text"
                fullWidth
                variant="outlined"
                value={newProject.users}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveProject} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
