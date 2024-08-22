import React from 'react';
import {
  Container, Box, Typography, IconButton, Modal, TextField, Button, Card, CardContent, Icon, InputAdornment, Avatar, AvatarGroup
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import api from '../../axiosInstance';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faHeading, faAlignLeft, faCalendar } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Project } from '../../interface/project.interface.ts';
import DialogDelete from './DialogDelete.tsx'; // Importar o DialogDeleteColumn
import ModalColumn from './components-kanban/ModalColumn.jsx'; // Importe o modal de edição
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import TaskEditModal from './components-kanban/TaskEditModal.jsx';
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed'; // Status limitado a 'pending' ou 'completed'
  users: number[];
  due_date?: string;
  project?: number;
  column: number;
}
// Definindo a interface para Column
interface Column {
  id: number;
  title: string;
  order: number;
  tasks: Task[];
  project: Project;
}
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  profileImageUrl: string;

}

// Definindo o estado inicial para o Kanban
const initialData: Record<string, Column> = {};

const Kanban = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const [data, setData] = React.useState<Record<string, Column>>(initialData);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<Task | null>(null);
  const [currentColumn, setCurrentColumn] = React.useState<Column | null>(null);
  const [newTaskTitles, setNewTaskTitles] = React.useState<Record<string, string>>({});
  const [newTaskDescriptions, setNewTaskDescriptions] = React.useState<Record<string, string>>({});
  const [newColumnName, setNewColumnName] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = React.useState(false);
  const [newTaskDueDates, setNewTaskDueDates] = React.useState<{ [key: string]: string }>({});
  const [project, setProject] = React.useState<Project | null>(null);
  const [openDeleteColumnDialog, setOpenDeleteColumnDialog] = React.useState(false);
  const [columnToDelete, setColumnToDelete] = React.useState(null);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = React.useState(false);
  const [tasks, setTasks] = React.useState<Record<number, Task>>({});
  const [avatarData, setAvatarData] = React.useState<Record<number, string[]>>({});
  interface UserPayload {
    sub: number;
    email: string;
  }
  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setShowArrows(containerRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial render

    return () => window.removeEventListener('resize', handleResize);
  }, [data]); // Added data dependency to check whenever columns are added or removed
  // Obtenha o projectId da URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin', { state: { error: 'Erro: Token JWT não encontrado.' } });
          return;
        }

        const decoded: UserPayload = jwtDecode(token);
        const userId = decoded.sub;

        // Buscar dados do projeto
        const response = await api.get(`/projects/${id}`);
        const projectData = response.data;

        const userIds = projectData.users.map((user: any) => user.id);
        if (!userIds.includes(userId)) {
          navigate('/dashboard/projects', { state: { error: 'Você não tem acesso a este projeto.' } });
          return;
        }

        // Buscar colunas associadas ao projeto
        const columnsResponse = await api.get('/columns');
        const allColumns = columnsResponse.data;

        // Filtrar colunas pelo ID do projeto
        const projectColumns = allColumns.filter((column: any) => column.project.id === projectData.id);

        // Buscar tarefas associadas ao projeto
        const tasksResponse = await api.get('/tasks');
        const allTasks = tasksResponse.data;

        // Filtrar tarefas pelo ID do projeto
        const projectTasks = allTasks.filter((task: any) => projectColumns.some((column: any) => column.id === task.column.id));

        // Criar um mapeamento de tarefas para acessar rapidamente por ID
        const tasksMap: Record<number, Task> = {};
        const avatarsMap: Record<number, string[]> = {}; // Mapeamento para armazenar os avatares por ID de tarefa

        // Percorrer cada tarefa e buscar detalhes dos avatares
        for (const task of projectTasks) {
          tasksMap[task.id] = task;
          const avatarUrls = await fetchTaskDetails(task.id); // Buscar os URLs dos avatares para essa tarefa
          avatarsMap[task.id] = avatarUrls;
        }

        // Formatar os dados das colunas para usar o ID da coluna como chave
        const formattedData: Record<string, Column> = {};
        projectColumns.forEach((column: Column) => {
          formattedData[column.id] = column;
        });

        setData(formattedData);
        setProject(projectData);
        setTasks(tasksMap);
        setAvatarData(avatarsMap); // Armazenar os URLs dos avatares no estado

      } catch (error) {
        navigate('/dashboard/projects', { state: { error: 'Erro ao buscar dados do projeto.' } });
      }
    };

    fetchData();
  }, [id, navigate, data]);// Dependência específica: estado data

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) {
      return; // Se a tarefa não for colocada em um destino válido, não faz nada
    }

    if (type === 'COLUMN') {
      const reorderedColumns = Array.from(Object.values(data));
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);

      try {
        for (let i = 0; i < reorderedColumns.length; i++) {
          const column = reorderedColumns[i];
          await api.put(`/columns/${column.id}`, { order: i + 1 });
          column.order = i + 1;
        }

        const newData: Record<string, Column> = {};
        reorderedColumns.forEach((column) => {
          newData[column.id] = column;
        });

        setData(newData);
      } catch (error) {
        console.error('Erro ao atualizar a ordem das colunas:', error);
      }
    } else {
      const sourceColumnId = source.droppableId;
      const destColumnId = destination.droppableId;

      if (sourceColumnId === destColumnId && source.index === destination.index) {
        return; // Se a posição não mudou dentro da mesma coluna, não faz nada
      }

      const sourceColumn = data[sourceColumnId];
      const destColumn = data[destColumnId];

      const item = sourceColumn.tasks[source.index];

      const updatedSourceItems = Array.from(sourceColumn.tasks);
      updatedSourceItems.splice(source.index, 1);

      const updatedDestItems = Array.from(destColumn.tasks);
      updatedDestItems.splice(destination.index, 0, item);

      const columnId = Number(destColumnId);

      try {
        const token = localStorage.getItem('token');

        await api.put(`/tasks/${draggableId}`, { column: columnId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData((prevData) => ({
          ...prevData,
          [sourceColumnId]: {
            ...sourceColumn,
            tasks: updatedSourceItems,
          },
          [destColumnId]: {
            ...destColumn,
            tasks: updatedDestItems,
          },
        }));
      } catch (error) {
        console.error('Erro ao mover tarefa:', error);
      }
    }
  };


  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    setTaskToDelete(task);
    setOpenDeleteTaskDialog(true);
  };

  const handleDeleteTaskConfirm = async () => {
    try {
      await api.delete(`/tasks/${taskToDelete.id}`);

      setData((prevData) => {
        const columnId = taskToDelete.status;
        const column = prevData[columnId];
        if (column) {
          const newColumnItems = column.tasks.filter((t) => t.id !== taskToDelete.id);
          return {
            ...prevData,
            [columnId]: {
              ...column,
              tasks: newColumnItems,
            },
          };
        } else {
          return prevData;
        }
      });
      setOpenDeleteTaskDialog(false);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const handleDeleteTaskCancel = () => {
    setOpenDeleteTaskDialog(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };
  const handleTaskUpdate = async () => {
    if (currentTask) {
      try {
        await api.put(`/tasks/${currentTask.id}`, {
          title: currentTask.title,
          description: currentTask.description,
          due_date: currentTask.due_date,
          users: currentTask.users, // Inclua os usuários selecionados
        });

        setData((prevData) => {
          if (!prevData[currentTask.status]) {
            console.error(`Coluna com status "${currentTask.status}" não encontrada.`);
            return prevData;
          }

          const updatedColumnItems = prevData[currentTask.status].tasks.map((t) =>
            t.id === currentTask.id ? { ...t, ...currentTask } : t
          );

          return {
            ...prevData,
            [currentTask.status]: {
              ...prevData[currentTask.status],
              tasks: updatedColumnItems,
            },
          };
        });

        handleModalClose();
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
      }
    } else {
      console.error('A tarefa não está definida.');
    }
  };

  const handleAddTask = async (columnId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token JWT não encontrado.');
      return;
    }

    try {
      const decoded: UserPayload = jwtDecode(token);
      const userId = decoded.sub;

      console.log('User ID from JWT:', userId); // Adicione este log para verificar o ID

      const newTask: Omit<Task, 'id'> = {
        title: newTaskTitles[columnId],
        description: newTaskDescriptions[columnId],
        status: 'pending',
        due_date: newTaskDueDates[columnId] || '',
        project: project?.id,
        users: [userId] || [],
        column: data[columnId].id,
      };

      console.log('Nova tarefa:', newTask);

      const response = await api.post('/tasks', newTask);
      const addedTask = response.data;

      console.log('Resposta do backend:', response);

      setData((prevData) => ({
        ...prevData,
        [columnId]: {
          ...prevData[columnId],
          tasks: [...prevData[columnId].tasks, addedTask],
        },
      }));

      setNewTaskTitles((prevTitles) => ({
        ...prevTitles,
        [columnId]: '',
      }));

      setNewTaskDescriptions((prevDescriptions) => ({
        ...prevDescriptions,
        [columnId]: '',
      }));

      setNewTaskDueDates((prevDueDates) => ({
        ...prevDueDates,
        [columnId]: '',
      }));
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      console.error('Erro detalhado:', error.message);
      console.error('Erro stack:', error.stack);
    }
  };


  const handleToggleTaskStatus = async (task: Task) => {
    // Define o novo status com base no status atual
    const newStatus: 'pending' | 'completed' = task.status === 'pending' ? 'completed' : 'pending';

    try {
      // Atualiza o status da tarefa no backend
      await api.put(`/tasks/${task.id}`, { status: newStatus });

      // Atualiza a coluna original com as novas informações
      setData((prevData) => {
        const updatedColumn = prevData[task.status];
        const updatedTask = { ...task, status: newStatus };

        if (updatedColumn && Array.isArray(updatedColumn.tasks)) {
          updatedColumn.tasks = updatedColumn.tasks.map((t) =>
            t.id === task.id ? updatedTask : t
          );
        }

        // Atualiza a coluna destino com as novas informações
        const destinationColumn = prevData[newStatus];
        if (destinationColumn && Array.isArray(destinationColumn.tasks)) {
          destinationColumn.tasks = [...destinationColumn.tasks, updatedTask];
        }

        return {
          ...prevData,
          [task.status]: updatedColumn,
          [newStatus]: destinationColumn,
        };
      });
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };
  const handleAddColumn = async () => {
    if (!newColumnName || !project?.id) return; // Verifique se o ID do projeto está disponível

    try {
      const response = await api.post('/columns', { title: newColumnName, projectId: project.id });
      const addedColumn = response.data;
      console.log('Coluna adicionada:', addedColumn);

      setData((prevData) => ({
        ...prevData,
        [addedColumn.id]: addedColumn, // Use o ID da coluna como chave
      }));

      setNewColumnName('');
    } catch (error) {
      console.error('Erro ao adicionar coluna:', error);
    }

    setIsColumnModalOpen(false);
  };
  // Função para excluir uma coluna
  const handleDeleteColumn = async (columnId: string) => {
    setColumnToDelete(columnId);
    setOpenDeleteColumnDialog(true);
  };

  const handleDeleteColumnConfirm = async () => {
    if (columnToDelete) {
      try {
        await api.delete(`/columns/${columnToDelete}`);
        // Recarrega os dados das colunas do backend após a exclusão
        const response = await api.get('/columns');
        const updatedColumns = response.data;

        // Atualiza o estado com os dados mais recentes
        setData(updatedColumns.reduce((acc: Record<string, Column>, column: Column) => {
          acc[column.id] = column;
          return acc;
        }, {}));
      } catch (error) {
        console.error('Erro ao deletar coluna:', error);
      }
      setOpenDeleteColumnDialog(false);
    }
  };

  const handleDeleteColumnCancel = () => {
    setOpenDeleteColumnDialog(false);
  };




  const handleEditColumn = (column: Column) => {
    setCurrentColumn(column);
    setIsColumnModalOpen(true);
  };

  const handleUpdateColumn = async () => {
    if (currentColumn) {
      try {
        await api.put(`/columns/${currentColumn.id}`, { title: currentColumn.title });

        setData((prevData) => ({
          ...prevData,
          [currentColumn.id]: {
            ...currentColumn,
          },
        }));

        setIsColumnModalOpen(false);
      } catch (error) {
        console.error('Erro ao atualizar coluna:', error);
      }
    }
  };

  const handleModalColumnClose = () => {
    setIsColumnModalOpen(false);
    setCurrentColumn(null);
    setNewColumnName('');
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  const getAvatarUrls = (users: User[]) => {
    return users.map(user => ({
      src: user.profileImageUrl, // Assume que `profileImageUrl` é uma propriedade obrigatória
      alt: `Avatar ${user.username}`,
    }));
  };

  const fetchTaskDetails = async (taskId: number) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      const taskData = response.data;

      // Extrair os URLs das imagens de perfil dos usuários associados à tarefa
      const avatarUrls = taskData.users.map((user: User) => user.profileImageUrl);

      return avatarUrls;
    } catch (error) {
      console.error(`Erro ao buscar detalhes da tarefa com ID ${taskId}:`, error);
      return [];
    }
  };
  // const renderTaskCard = (task: Task) => {
  //   const [avatarUrls, setAvatarUrls] = React.useState<string[]>([]);

  //   React.useEffect(() => {
  //     const fetchAvatars = async () => {
  //       const urls = await fetchTaskDetails(task.id);
  //       setAvatarUrls(urls);
  //     };

  //     fetchAvatars();
  //   }, [task.id]);

  return (
    < Container maxWidth={false} >
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          {project ? project.name : 'Kanban Board'}
        </Typography>
        <Box ml="auto">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsColumnModalOpen(true)}
          >
            Add Column
          </Button>
        </Box>
      </Box>
      <Box position="relative" ref={containerRef} display="flex" py={2} style={{ overflowX: 'scroll' }} >
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(data).map(([columnId, column]) => (
            <Droppable droppableId={columnId} key={columnId} direction="horizontal">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  width={300}
                  minHeight={500}
                  bgcolor="#f5f5f5"
                  borderRadius={2}
                  p={1}
                  m={1}
                  boxShadow={1}
                  flexShrink={0}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    {column && (
                      <Typography variant="h6" component="h2">
                        {column.title}
                      </Typography>
                    )}
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditColumn(column)}
                        style={{ marginRight: 8 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteColumn(column.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  {column && column.tasks && column.tasks.map((task, index) => (
                    task && task.id && task.status && (
                      <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                        {(provided) => {
                          // Define a cor de fundo com base no status da tarefa
                          const backgroundColor = task.status === 'completed' ? '#d4edda' : '#f8d7da'; // Verde claro para completado, vermelho claro para pendente

                          const taskId = task.id; // Substitua isso pelo ID da tarefa relevante
                          const avatarUrls = avatarData[taskId] || [];
                          return (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              mb={2}
                              bgcolor={backgroundColor}
                              p={1}
                              borderRadius={2}
                              boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                            >
                              <Box display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
                                <Typography variant="h6" component="h3" gutterBottom>
                                  {task.title}
                                </Typography>
                                <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                                  <Icon color="action" sx={{ marginRight: 1 }}>
                                    <DescriptionIcon />
                                  </Icon>
                                  <Typography variant="body2" color="textSecondary" gutterBottom sx={{ marginTop: 1 }}>
                                    {task.description}
                                  </Typography>
                                </Box>
                                <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                                  <Icon color="action" sx={{ marginRight: 1 }}>
                                    <CalendarTodayIcon />
                                  </Icon>
                                  <Typography variant="body2" color="textSecondary" gutterBottom sx={{ marginTop: 1 }}>
                                    {new Date(task.due_date ?? '').toLocaleDateString('pt-BR', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </Typography>
                                </Box>
                                <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                                  <AvatarGroup max={3}>
                                    {avatarUrls.map((url, index) => (
                                      <Avatar key={index} src={url} />
                                    ))}
                                  </AvatarGroup>
                                </Box>
                              </Box>
                              <Box display="flex" alignItems="center">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditTask(task)}
                                  style={{ marginRight: 8 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteTask(task)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleTaskStatus(task)}
                                >
                                  {task.status === 'completed' ? (
                                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                                  ) : (
                                    <CancelOutlinedIcon color="error" fontSize="small" />
                                  )}
                                </IconButton>
                              </Box>
                            </Box>
                          );
                        }}
                      </Draggable>
                    )
                  ))}
                  {provided.placeholder}


                  <Card>
                    <CardContent>
                      <TextField
                        fullWidth
                        label="Titulo Tarefa"
                        value={newTaskTitles[columnId] || ''}
                        onChange={(e) =>
                          setNewTaskTitles({ ...newTaskTitles, [columnId]: e.target.value })
                        }
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Descrição Tarefa"
                        value={newTaskDescriptions[columnId] || ''}
                        onChange={(e) =>
                          setNewTaskDescriptions({
                            ...newTaskDescriptions,
                            [columnId]: e.target.value,
                          })
                        }
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Data de vencimento"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newTaskDueDates[columnId] || ''}
                        onChange={(e) =>
                          setNewTaskDueDates({
                            ...newTaskDueDates,
                            [columnId]: e.target.value,
                          })
                        }
                        margin="normal"
                        variant="outlined"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddTask(columnId)}
                      >
                        Add Task
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
      {
        showArrows && (
          <>
            <IconButton
              onClick={scrollLeft}
              sx={{
                position: 'absolute',
                left: sidebarOpen ? 240 : 80,
                top: '50%',
                transform: 'translateY(-20%)',
                zIndex: 1,
                backgroundColor: '#1976d2',
                borderRadius: '50%',
                boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                '&:hover': { backgroundColor: '#115293' },
              }}
            >
              <ArrowBackIosNewIcon sx={{ color: 'white' }} />
            </IconButton>

            <IconButton
              onClick={scrollRight}
              sx={{
                position: 'absolute',
                right: sidebarOpen ? 20 : 20,
                top: '50%',
                transform: 'translateY(-20%)',
                zIndex: 1,
                backgroundColor: '#1976d2',
                borderRadius: '50%',
                boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                '&:hover': { backgroundColor: '#115293' },
              }}
            >
              <ArrowForwardIosIcon sx={{ color: 'white' }} />
            </IconButton>
          </>
        )
      }
      {/* Modal para edição de tarefas */}
      <TaskEditModal
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        projectId={project?.id}
        handleTaskUpdate={handleTaskUpdate}
      />
      {/* Modal para edição de colunas */}
      <ModalColumn
        isColumnModalOpen={isColumnModalOpen}
        handleModalColumnClose={handleModalColumnClose}
        currentColumn={currentColumn}
        setCurrentColumn={setCurrentColumn}
        handleUpdateColumn={handleUpdateColumn}
        newColumnName={newColumnName}
        setNewColumnName={setNewColumnName}
        handleAddColumn={handleAddColumn}
      />
      <DialogDelete
        open={openDeleteColumnDialog}
        onClose={handleDeleteColumnCancel}
        onDelete={handleDeleteColumnConfirm}
        itemType="column"
      />
      <DialogDelete
        open={openDeleteTaskDialog}
        onClose={handleDeleteTaskCancel}
        onDelete={handleDeleteTaskConfirm}
        itemType="task"
      />
    </Container >

  );
};

export default Kanban;
