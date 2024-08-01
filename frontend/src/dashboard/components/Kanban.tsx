import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  IconButton,
  Modal,
  TextField,
  Button,
  Card,
  CardContent,
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

// Definindo a interface para Task
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  completed: boolean;
}

// Definindo a interface para Column
interface Column {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
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
  const [column, setColumn] = React.useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = React.useState(0);

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
    // Função para buscar dados das colunas e tarefas do backend
    const fetchData = async () => {
      try {
        const response = await api.get('/columns');
        const columns: Column[] = response.data;
        const formattedData: Record<string, Column> = {};

        columns.forEach((column) => {
          formattedData[column.title] = column;
        });

        setData(formattedData);
      } catch (error) {
        console.error('Erro ao buscar dados do backend:', error);
      }
    };

    fetchData();
  }, []);

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
    try {
      await api.delete(`/tasks/${task.id}`);

      setData((prevData) => {
        const newColumnItems = prevData[task.status].tasks.filter((t) => t.id !== task.id);
        return {
          ...prevData,
          [task.status]: {
            ...prevData[task.status],
            tasks: newColumnItems,
          },
        };
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
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
          completed: currentTask.completed,
        });

        setData((prevData) => {
          const updatedColumnItems = prevData[currentTask.status].tasks.map((t) =>
            t.id === currentTask.id ? currentTask : t
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
    }
  };

  const handleAddTask = async (column: string) => {
    const newTask: Task = {
      id: '',
      title: newTaskTitles[column],
      description: newTaskDescriptions[column],
      status: column,
      completed: false,
    };

    try {
      const response = await api.post('/tasks', newTask);
      const addedTask = response.data;

      setData((prevData) => ({
        ...prevData,
        [column]: {
          ...prevData[column],
          tasks: [...prevData[column].tasks, addedTask],
        },
      }));

      setNewTaskTitles((prevTitles) => ({
        ...prevTitles,
        [column]: '',
      }));

      setNewTaskDescriptions((prevDescriptions) => ({
        ...prevDescriptions,
        [column]: '',
      }));
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    try {
      await api.put(`/tasks/${task.id}`, { completed: !task.completed });

      setData((prevData) => {
        const updatedColumnItems = prevData[task.status].tasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        );
        return {
          ...prevData,
          [task.status]: {
            ...prevData[task.status],
            tasks: updatedColumnItems,
          },
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
    const confirmDelete = window.confirm('Você tem certeza que deseja excluir esta coluna?');

    if (!confirmDelete) return;

    try {
      await api.delete(`/columns/${columnId}`);

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
          Kanban Board
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
                    <Typography variant="h6" component="h2">
                      {column.title}
                    </Typography>
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

                  {column.tasks.map((task, index) => (
                    <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          mb={1}
                          bgcolor="white"
                          p={1}
                          borderRadius={2}
                          boxShadow={1}
                        >
                          <Typography variant="subtitle1" component="h3" gutterBottom>
                            {task.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {task.description}
                          </Typography>
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
                              {task.completed ? (
                                <CheckCircleOutlineIcon color="primary" fontSize="small" />
                              ) : (
                                <CancelOutlinedIcon color="error" fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <Card>
                    <CardContent>
                      <TextField
                        fullWidth
                        label="Task Title"
                        value={newTaskTitles[columnId] || ''}
                        onChange={(e) =>
                          setNewTaskTitles({ ...newTaskTitles, [columnId]: e.target.value })
                        }
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Task Description"
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
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={3}
          p={4}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Task
          </Typography>
          {currentTask && (
            <>
              <TextField
                fullWidth
                label="Title"
                value={currentTask.title}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, title: e.target.value })
                }
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Description"
                value={currentTask.description}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, description: e.target.value })
                }
                margin="normal"
                variant="outlined"
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTaskUpdate}
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={handleModalClose}>
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para edição de colunas */}
      <Modal open={isColumnModalOpen} onClose={handleModalColumnClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={3}
          p={4}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6" gutterBottom>
            {currentColumn ? 'Edit Column' : 'Add Column'}
          </Typography>
          <TextField
            fullWidth
            label="Column Name"
            value={currentColumn ? currentColumn.title : newColumnName}
            onChange={(e) =>
              currentColumn
                ? setCurrentColumn({ ...currentColumn, title: e.target.value })
                : setNewColumnName(e.target.value)
            }
            margin="normal"
            variant="outlined"
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={currentColumn ? handleUpdateColumn : handleAddColumn}
              style={{ marginRight: 8 }}
            >
              {currentColumn ? 'Save' : 'Add'}
            </Button>
            <Button variant="outlined" onClick={handleModalColumnClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container >
  );
};

export default Kanban;
