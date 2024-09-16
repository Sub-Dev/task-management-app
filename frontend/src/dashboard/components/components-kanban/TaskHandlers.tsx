import api from "../../../axiosInstance";
import { jwtDecode } from 'jwt-decode';
import { Task, UserPayload } from './Interfaces.tsx'; // Ajuste o caminho conforme necessário

export const handleAddTask = async (
  columnId: number,
  newTaskTitles: Record<number, string>,
  newTaskDescriptions: Record<number, string>,
  newTaskDueDates: Record<number, string>,
  project: any,
  data: Record<string, any>,
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setNewTaskTitles: React.Dispatch<React.SetStateAction<Record<number, string>>>,
  setNewTaskDescriptions: React.Dispatch<React.SetStateAction<Record<number, string>>>,
  setNewTaskDueDates: React.Dispatch<React.SetStateAction<Record<number, string>>>
) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token JWT não encontrado.');
    return;
  }

  try {
    const decoded: UserPayload = jwtDecode(token);
    const userId = decoded.sub;

    const newTask: Omit<Task, 'id'> = {
      title: newTaskTitles[columnId],
      description: newTaskDescriptions[columnId],
      status: 'pending',
      due_date: newTaskDueDates[columnId] || '',
      project: project?.id,
      users: [userId] || [],
      column: data[columnId].id,
    };

    const response = await api.post('/tasks', newTask);
    const addedTask = response.data;

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

export const handleToggleTaskStatus = async (
  task: Task,
  data: Record<string, any>,
  setData: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  const newStatus: 'pending' | 'completed' = task.status === 'pending' ? 'completed' : 'pending';

  setData((prevData) => {
    const updatedColumn = prevData[task.columnId];

    if (updatedColumn && Array.isArray(updatedColumn.tasks)) {
      const updatedTasks = updatedColumn.tasks.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      );

      return {
        ...prevData,
        [task.columnId]: {
          ...updatedColumn,
          tasks: updatedTasks,
        },
      };
    }

    return prevData;
  });

  try {
    await api.put(`/tasks/${task.id}`, { status: newStatus });
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error);

    setData((prevData) => {
      const updatedColumn = prevData[task.columnId];

      if (updatedColumn && Array.isArray(updatedColumn.tasks)) {
        const revertedTasks = updatedColumn.tasks.map((t) =>
          t.id === task.id ? { ...t, status: task.status } : t
        );

        return {
          ...prevData,
          [task.columnId]: {
            ...updatedColumn,
            tasks: revertedTasks,
          },
        };
      }

      return prevData;
    });
  }
};

interface HandleDeleteTaskConfirmParams {
  taskToDelete: Task | null;
  setData: (data: any) => void;
  setOpenDeleteTaskDialog: (isOpen: boolean) => void;
}

export const handleDeleteTaskConfirm = async ({
  taskToDelete,
  setData,
  setOpenDeleteTaskDialog
}: HandleDeleteTaskConfirmParams) => {
  if (!taskToDelete) return;

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
interface HandleTaskUpdateParams {
  currentTask: Task | null;
  setData: (data: any) => void;
  handleModalClose: () => void;
}

export const handleTaskUpdate = async ({
  currentTask,
  setData,
  handleModalClose
}: HandleTaskUpdateParams) => {
  if (currentTask) {
    try {
      await api.put(`/tasks/${currentTask.id}`, {
        title: currentTask.title,
        description: currentTask.description,
        due_date: currentTask.due_date,
        users: currentTask.users,
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