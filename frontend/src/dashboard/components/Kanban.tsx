// src/dashboard/components/Kanban.tsx
import React from 'react';
import { Container, Box, Typography, Paper, IconButton, Modal, TextField, Button, Card, CardContent } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  completed: boolean;
}


const initialData: Record<string, Task[]> = {
  todo: [
    { id: '1', title: 'Task 1', description: 'Description of Task 1', status: 'todo', completed: false },
    { id: '2', title: 'Task 2', description: 'Description of Task 2', status: 'todo', completed: false },
  ],
  inProgress: [
    { id: '3', title: 'Task 3', description: 'Description of Task 3', status: 'inProgress', completed: false },
  ],
  done: [
    { id: '4', title: 'Task 4', description: 'Description of Task 4', status: 'done', completed: true },
  ],
};

const Kanban = ({ sidebarOpen }) => {
  const [data, setData] = React.useState(initialData);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<Task | null>(null);
  const [currentColumn, setCurrentColumn] = React.useState<string | null>(null);
  const [newTaskTitles, setNewTaskTitles] = React.useState<Record<string, string>>({});
  const [newTaskDescriptions, setNewTaskDescriptions] = React.useState<Record<string, string>>({});
  const [newColumnName, setNewColumnName] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = React.useState(false);

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

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return; // Se a tarefa não for colocada em um destino válido, não faz nada
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn && source.index === destination.index) {
      return; // Se a posição não mudou dentro da mesma coluna, não faz nada
    }

    // Encontra a tarefa arrastada no estado atual
    const item = data[sourceColumn][source.index];

    // Cria uma nova cópia da tarefa com o status atualizado para a nova coluna
    const newItem = { ...item, status: destColumn };

    // Atualiza o estado removendo a tarefa da coluna de origem
    const updatedSourceItems = Array.from(data[sourceColumn]);
    updatedSourceItems.splice(source.index, 1);

    // Atualiza o estado adicionando a tarefa à coluna de destino
    const updatedDestItems = Array.from(data[destColumn]);
    updatedDestItems.splice(destination.index, 0, newItem);

    setData((prevData) => ({
      ...prevData,
      [sourceColumn]: updatedSourceItems,
      [destColumn]: updatedDestItems,
    }));
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setData((prevData) => {
      const newColumnItems = prevData[task.status].filter((t) => t.id !== task.id);
      return {
        ...prevData,
        [task.status]: newColumnItems,
      };
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleTaskUpdate = () => {
    if (currentTask) {
      setData((prevData) => {
        const updatedColumnItems = prevData[currentTask.status].map((t) =>
          t.id === currentTask.id ? currentTask : t
        );
        return {
          ...prevData,
          [currentTask.status]: updatedColumnItems,
        };
      });
      handleModalClose();
    }
  };

  const handleAddTask = (column: string) => {
    const newTask: Task = {
      id: (Math.random() * 10000).toString(),
      title: newTaskTitles[column],
      description: newTaskDescriptions[column],
      status: column as 'todo' | 'inProgress' | 'done',
      completed: false,
    };

    setData((prevData) => ({
      ...prevData,
      [column]: [...prevData[column], newTask],
    }));

    setNewTaskTitles((prevTitles) => ({
      ...prevTitles,
      [column]: '',
    }));

    setNewTaskDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [column]: '',
    }));
  };

  const handleToggleTaskStatus = (task: Task) => {
    setData((prevData) => {
      const updatedColumnItems = prevData[task.status].map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      );
      return {
        ...prevData,
        [task.status]: updatedColumnItems,
      };
    });
  };

  const handleAddColumn = () => {
    if (!newColumnName) return;
    setData((prevData) => ({
      ...prevData,
      [newColumnName]: [],
    }));
    setNewColumnName('');
    setIsColumnModalOpen(false);
  };

  const handleColumnEdit = (column: string) => {
    setCurrentColumn(column);
    setNewColumnName(column);
    setIsColumnModalOpen(true);
  };

  const handleColumnUpdate = () => {
    if (!currentColumn) return;
    const newData: Record<string, Task[]> = {};
    for (const key in data) {
      if (key === currentColumn) {
        newData[newColumnName] = data[key];
      } else {
        newData[key] = data[key];
      }
    }
    setData(newData);
    setCurrentColumn(null);
    setNewColumnName('');
    setIsColumnModalOpen(false);
  };

  const handleDeleteColumn = (column: string) => {
    const { [column]: _, ...rest } = data;
    setData(rest);
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
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Card sx={{ mb: 1, boxShadow: 3, backgroundColor: '#f4f4f4', width: '100%' }}>
          <CardContent>
            <Typography
              variant="h5"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                color: '#333',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              Projeto: TaskMaster Kanban Board
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => setIsColumnModalOpen(true)}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#115293' },
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Adicionar Coluna
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {showArrows && (
        <>
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: 'absolute',
              left: sidebarOpen ? 240 : 120,
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
              right: sidebarOpen ? 20 : 80,
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
      )}
      <Box sx={{ position: 'relative', overflowX: 'auto', display: 'flex' }} ref={containerRef}>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(data).map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minWidth: 250,
                    p: 2,
                    mr: 2,
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                    {column}
                    <IconButton
                      onClick={() => handleColumnEdit(column)}
                      sx={{ ml: 2 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteColumn(column)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Typography>
                  {data[column].map((task, index) => (
                    <Draggable draggableId={task.id} index={index} key={task.id}>
                      {(provided) => (
                        <Paper
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          sx={{
                            mb: 2,
                            p: 2,
                            backgroundColor: task.completed ? '#c8e6c9' : '#fff',
                            boxShadow: 2,
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 4 },
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {task.title}
                          </Typography>
                          <Typography variant="body2">{task.description}</Typography>
                          <Box sx={{ mt: 1 }}>
                            <IconButton
                              onClick={() => handleEditTask(task)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteTask(task)}
                              sx={{ mr: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleToggleTaskStatus(task)}
                            >
                              {task.completed ? (
                                <CancelOutlinedIcon />
                              ) : (
                                <CheckCircleOutlineIcon />
                              )}
                            </IconButton>
                          </Box>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Título da nova tarefa"
                      variant="outlined"
                      fullWidth
                      value={newTaskTitles[column] || ''}
                      onChange={(e) => setNewTaskTitles({ ...newTaskTitles, [column]: e.target.value })}
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Descrição da nova tarefa"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      value={newTaskDescriptions[column] || ''}
                      onChange={(e) => setNewTaskDescriptions({ ...newTaskDescriptions, [column]: e.target.value })}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAddTask(column)}
                      startIcon={<AddIcon />}
                      sx={{ mt: 1 }}
                    >
                      Adicionar Tarefa
                    </Button>
                  </Box>
                </Box>
              )}
            </Droppable>
          ))}
        </DragDropContext>


      </Box>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Editar Tarefa
          </Typography>
          {currentTask && (
            <>
              <TextField
                label="Título"
                variant="outlined"
                fullWidth
                value={currentTask.title}
                onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={currentTask.description}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleTaskUpdate}
                sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
              >
                Atualizar
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentColumn ? 'Editar Coluna' : 'Adicionar Nova Coluna'}
          </Typography>
          <TextField
            label="Nome da Coluna"
            variant="outlined"
            fullWidth
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={currentColumn ? handleColumnUpdate : handleAddColumn}
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
          >
            {currentColumn ? 'Atualizar Coluna' : 'Adicionar Coluna'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Kanban;
