import React from 'react';
import {
  Container,
  Box,
  Typography,
  IconButton,
  Modal,
  TextField,
  Button,
  Card,
  CardContent,
  Icon,
  InputAdornment,

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
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed'; // Status limitado a 'pending' ou 'completed'
  users?: number[];
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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/columns');
        const columns: Column[] = response.data;
        const formattedData: Record<string, Column> = {};

        columns.forEach((column) => {
          formattedData[column.title] = column;
        });

        setData(formattedData);

        // Obter o projeto do primeiro elemento
        const firstColumn = columns[0]; // ou outra lógica para selecionar um projeto
        if (firstColumn) {
          setProject(firstColumn.project); // Define o projeto diretamente
        }
      } catch (error) {
        console.error('Erro ao buscar dados do backend:', error);
      }
    };

    fetchData();
  }, [data]); // Dependência específica: estado data

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return; // Se a tarefa não for colocada em um destino válido, não faz nada
    }

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    if (sourceColumnId === destColumnId && source.index === destination.index) {
      return; // Se a posição não mudou dentro da mesma coluna, não faz nada
    }

    const sourceColumn = data[sourceColumnId];
    const destColumn = data[destColumnId];

    const item = sourceColumn.tasks[source.index];

    // Atualiza o estado local removendo a tarefa da coluna de origem
    const updatedSourceItems = Array.from(sourceColumn.tasks);
    updatedSourceItems.splice(source.index, 1);

    // Atualiza o estado local adicionando a tarefa à coluna de destino
    const updatedDestItems = Array.from(destColumn.tasks);
    updatedDestItems.splice(destination.index, 0, item);

    // Atualiza o status da tarefa no backend
    try {
      await api.put(`/tasks/${draggableId}`, { status: destColumnId });

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
    if (currentTask && currentTask.status) {
      try {

        await api.put(`/tasks/${currentTask.id}`, {
          title: currentTask.title,
          description: currentTask.description,
          due_date: currentTask.due_date,
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
      console.error('A tarefa ou o status da tarefa não está definido.');
    }
  };

  const handleAddTask = async (columnId: number) => {
    const newTask: Omit<Task, 'id'> = {
      title: newTaskTitles[columnId],
      description: newTaskDescriptions[columnId],
      status: 'pending',
      due_date: newTaskDueDates[columnId] || '',
      project: 1, // ID do projeto ao qual a tarefa pertence
      users: [1], // ID do usuário responsável
      column: data[columnId].id, // Passa o ID da coluna como número
    };

    console.log('Nova tarefa:', newTask);

    try {
      const response = await api.post('/tasks', newTask); // O backend deve gerar o ID
      const addedTask = response.data;

      console.log('Resposta do backend:', response);

      setData((prevData) => ({
        ...prevData,
        [columnId]: {
          ...prevData[columnId],
          tasks: [...prevData[columnId].tasks, addedTask], // Adiciona a tarefa com o ID gerado
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
    if (!newColumnName) return;

    try {
      const response = await api.post('/columns', { title: newColumnName });
      const addedColumn = response.data;

      setData((prevData) => ({
        ...prevData,
        [addedColumn.title]: addedColumn,
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

      <Box position="relative" ref={containerRef} overflow="auto" display="flex" py={2}>


        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(data).map(([columnId, column]) => (
            <Droppable droppableId={columnId} key={columnId}>
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
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          bgcolor="#f7f7f7"
          borderRadius={2}
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
          p={4}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h4" gutterBottom>
            <FontAwesomeIcon icon={faEdit} /> Edição de Tarefa
          </Typography>
          {currentTask && (
            <>
              <TextField
                fullWidth
                label="Titulo Tarefa"
                value={currentTask.title}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, title: e.target.value })
                }
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faHeading} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Descrição"
                value={currentTask.description}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, description: e.target.value })
                }
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faAlignLeft} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Data de vencimento"
                type="date"
                value={moment(currentTask.due_date).format('YYYY-MM-DD')}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, due_date: e.target.value })
                }
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faCalendar} />
                    </InputAdornment>
                  ),
                }}
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTaskUpdate}
                  style={{ marginRight: 8 }}
                >
                  <FontAwesomeIcon icon={faSave} size="lg"
                    style={{ marginRight: 4 }} />                <Typography variant="button" component="span" mt={0.2} ml={1}>
                    Salvar
                  </Typography>
                </Button>
                <Button variant="outlined" onClick={handleModalClose}>
                  <FontAwesomeIcon icon={faTimes} size="lg"
                    style={{ marginRight: 4 }} />
                  <Typography variant="button" component="span" mt={0.2} ml={1}>
                    Cancelar
                  </Typography>
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

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
