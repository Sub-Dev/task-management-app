import React from 'react';
import {
  Container, Box, Typography, IconButton, Icon,
  Avatar, AvatarGroup, Select, MenuItem, FormControl, InputLabel, Tooltip, SelectChangeEvent
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import api from '../../axiosInstance';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Column, Task, UserPayload, User, Project } from '../components/components-kanban/Interfaces.tsx'
import DialogDelete from './components-kanban/DialogDelete.tsx';
import ModalColumn from './components-kanban/ModalColumn.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import TaskEditModal from './components-kanban/TaskEditModal.jsx';
import KanbanHeader from '../components/components-kanban/KanbanHeader.tsx';
import TaskForm from '../components/components-kanban/TaskForm.tsx';
import ScrollArrows from '../components/components-kanban/ScrollArrows.tsx';
import { fetchTaskDetails, handleOrderChange, updateColumnOrder } from './components-kanban/KanbanHelpers.tsx';
import { onDragEnd } from './components-kanban/DragAndDropHandlers.tsx';
import { handleAddTask, handleToggleTaskStatus, handleDeleteTaskConfirm, handleTaskUpdate } from './components-kanban/TaskHandlers.tsx';
import { handleAddColumn, handleDeleteColumnConfirm, handleUpdateColumn } from './components-kanban/ColumnHandlers.tsx';
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
  const [columnToDelete, setColumnToDelete] = React.useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = React.useState(false);
  const [tasks, setTasks] = React.useState<Record<number, Task>>({});
  const [avatarData, setAvatarData] = React.useState<Record<number, string[]>>({});
  const [columnOrder, setColumnOrder] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setShowArrows(containerRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

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
        const response = await api.get(`/projects/${id}`);
        const projectData = response.data;

        const userIds = projectData.users.map((user: any) => user.id);
        if (!userIds.includes(userId)) {
          navigate('/dashboard/projects', { state: { error: 'Você não tem acesso a este projeto.' } });
          return;
        }
        const columnsResponse = await api.get('/columns');
        const allColumns = columnsResponse.data;

        const projectColumns = allColumns
          .filter((column: any) => column.project.id === projectData.id)
          .sort((a: any, b: any) => a.order - b.order);

        const tasksResponse = await api.get('/tasks');
        const allTasks = tasksResponse.data;

        const projectTasks = allTasks.filter((task: any) => projectColumns.some((column: any) => column.id === task.column.id));

        const tasksMap: Record<number, Task> = {};
        const avatarsMap: Record<number, string[]> = {};


        for (const task of projectTasks) {
          tasksMap[task.id] = task;
          const avatarUrls = await fetchTaskDetails(task.id);
          avatarsMap[task.id] = avatarUrls;
        }


        const formattedData: Record<string, Column> = {};
        projectColumns.forEach((column: Column) => {
          formattedData[column.id] = column;
        });

        setData(formattedData);
        setProject(projectData);
        setTasks(tasksMap);
        setAvatarData(avatarsMap);

      } catch (error) {
        navigate('/dashboard/projects', { state: { error: 'Erro ao buscar dados do projeto.' } });
      }
    };

    fetchData();
  }, [id, navigate, data]);


  const handleAddTaskWrapper = (columnId: number) => {
    handleAddTask(
      columnId,
      newTaskTitles,
      newTaskDescriptions,
      newTaskDueDates,
      project,
      data,
      setData,
      setNewTaskTitles,
      setNewTaskDescriptions,
      setNewTaskDueDates
    );
  };
  const handleDeleteTaskConfirmWrapper = async () => {
    await handleDeleteTaskConfirm({
      taskToDelete,
      setData,
      setOpenDeleteTaskDialog
    });
  };
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    setTaskToDelete(task);
    setOpenDeleteTaskDialog(true);
  };

  const handleDeleteTaskCancel = () => {
    setOpenDeleteTaskDialog(false);
  };


  const handleToggleTaskStatusWrapper = async (task: Task) => {
    await handleToggleTaskStatus(task, data, setData);
  };

  const handleTaskUpdateWrapper = async () => {
    await handleTaskUpdate({
      currentTask,
      setData,
      handleModalClose
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleAddColumnWrapper = async () => {
    await handleAddColumn({
      newColumnName,
      projectId: project?.id,
      data,
      setData,
      setNewColumnName,
      setIsColumnModalOpen,
    });
  };


  const handleDeleteColumn = async (columnId: string) => {
    setColumnToDelete(columnId);
    setOpenDeleteColumnDialog(true);
  };

  const handleDeleteColumnWrapper = async () => {
    const columnId = typeof columnToDelete === 'string' ? parseInt(columnToDelete, 10) : columnToDelete;
    if (columnId !== null && !isNaN(columnId)) {
      await handleDeleteColumnConfirm({
        columnToDelete: columnId,
        setData,
        setOpenDeleteColumnDialog,
      });
    } else {
      console.error('columnToDelete não é um número válido:', columnToDelete);
    }
  };

  const handleDeleteColumnCancel = () => {
    setOpenDeleteColumnDialog(false);
  };

  const handleEditColumn = (column: Column) => {
    setCurrentColumn(column);
    setIsColumnModalOpen(true);
  };

  const handleColumnUpdate = () => {
    handleUpdateColumn(currentColumn, setData, setIsColumnModalOpen);
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
  const onOrderChange = (columnId: string, e: SelectChangeEvent<string>) => {
    const newOrder = Number(e.target.value);
    if (!isNaN(newOrder)) {
      handleOrderChange(columnId, newOrder, columnOrder, setColumnOrder, data, updateColumnOrder);
    } else {
      console.error('O valor convertido não é um número válido:', e.target.value);
    }
  };

  return (
    < Container maxWidth={false} >
      <KanbanHeader
        project={project}
        setIsColumnModalOpen={setIsColumnModalOpen}
      />
      <Box position="relative" ref={containerRef} display="flex" py={2} style={{ overflowX: 'scroll' }} >
        <DragDropContext onDragEnd={(result) => onDragEnd(result, data, setData)}>
          {Object.entries(data).sort(([, aColumn], [, bColumn]) => aColumn.order - bColumn.order).map(([columnId, column]) => (
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
                      <FormControl size="small" style={{ marginRight: 8 }}>
                        <InputLabel>Ordem</InputLabel>
                        <Tooltip title="Selecione a ordem das colunas" placement="top">
                          <Select
                            value={columnOrder[columnId] !== undefined ? columnOrder[columnId] : column.order}
                            onChange={(e) => onOrderChange(columnId, e)}
                            disabled={loading}
                          >
                            {[...Array(Object.keys(data).length).keys()].map(order => (
                              <MenuItem key={order} value={order + 1}> {/* Adiciona +1 ao valor de `order` */}
                                {order + 1} {/* Exibe valores de 1 a n */}
                              </MenuItem>
                            ))}
                          </Select>
                        </Tooltip>
                      </FormControl>
                      <Tooltip title="Editar Coluna" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => handleEditColumn(column)}
                          style={{ marginRight: 8 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar Coluna" placement="top">
                        <IconButton size="small" onClick={() => handleDeleteColumn(String(column.id))}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {column && column.tasks && column.tasks.map((task, index) => (
                    task && task.id && task.status && (
                      <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                        {(provided) => {

                          const backgroundColor = task.status === 'completed' ? '#d4edda' : '#f8d7da';

                          const taskId = task.id;
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
                                <Tooltip title="Editar Tarefa" placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditTask(task)}
                                    style={{ marginRight: 8 }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Deletar Tarefa" placement="top">
                                  <IconButton size="small" onClick={() => handleDeleteTask(task)}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleTaskStatusWrapper(task)}
                                >
                                  <Tooltip title={task.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluída'} placement="top">
                                    {task.status === 'completed' ? (
                                      <CheckCircleOutlineIcon color="primary" fontSize="small" />
                                    ) : (
                                      <CancelOutlinedIcon color="error" fontSize="small" />
                                    )}
                                  </Tooltip>
                                </IconButton>
                              </Box>
                            </Box>
                          );
                        }}
                      </Draggable>
                    )
                  ))}
                  {provided.placeholder}
                  <TaskForm
                    columnId={columnId}
                    newTaskTitles={newTaskTitles}
                    setNewTaskTitles={setNewTaskTitles}
                    newTaskDescriptions={newTaskDescriptions}
                    setNewTaskDescriptions={setNewTaskDescriptions}
                    newTaskDueDates={newTaskDueDates}
                    setNewTaskDueDates={setNewTaskDueDates}
                    handleAddTask={handleAddTaskWrapper}
                  />
                </Box>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
      <ScrollArrows
        showArrows={showArrows}
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        sidebarOpen={sidebarOpen}
      />
      <TaskEditModal
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        projectId={project?.id}
        handleTaskUpdate={handleTaskUpdateWrapper}
      />
      <ModalColumn
        isColumnModalOpen={isColumnModalOpen}
        handleModalColumnClose={handleModalColumnClose}
        currentColumn={currentColumn}
        setCurrentColumn={setCurrentColumn}
        handleUpdateColumn={handleColumnUpdate}
        newColumnName={newColumnName}
        setNewColumnName={setNewColumnName}
        handleAddColumn={handleAddColumnWrapper}
        projectColumns={Object.values(data)}
      />
      <DialogDelete
        open={openDeleteColumnDialog}
        onClose={handleDeleteColumnCancel}
        onDelete={handleDeleteColumnWrapper}
        itemType="column"
      />
      <DialogDelete
        open={openDeleteTaskDialog}
        onClose={handleDeleteTaskCancel}
        onDelete={handleDeleteTaskConfirmWrapper}
        itemType="task"
      />
    </Container >

  );
};
export default Kanban;
