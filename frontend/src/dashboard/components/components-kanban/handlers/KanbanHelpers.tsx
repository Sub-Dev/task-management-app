
import api from "../../../../axiosInstance.js";
import { User, Column } from '../interface/Interfaces.tsx';
import { Dispatch, SetStateAction } from 'react';
import { SelectChangeEvent } from '@mui/material';

export const fetchTaskDetails = async (taskId: number) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    const taskData = response.data;

    const avatarUrls = taskData.users.map((user: User) => user.profileImageUrl);

    return avatarUrls;
  } catch (error) {
    console.error(`Erro ao buscar detalhes da tarefa com ID ${taskId}:`, error);
    return [];
  }
};

export const updateColumnOrder = async (newColumnOrder) => {
  try {
    await Promise.all(
      Object.entries(newColumnOrder).map(([columnId, order]) =>
        api.put(`/columns/${columnId}`, { order })
      )
    );
  } catch (error) {
    console.error('Erro ao atualizar a ordem das colunas:', error);
  }
};

export const handleOrderChange = async (
  columnId: string,
  newOrder: number,
  columnOrder: Record<string, number>,
  setColumnOrder: Dispatch<SetStateAction<Record<string, number>>>,
  data: Record<string, Column>,
  updateColumnOrder: (order: Record<string, number>) => Promise<void>
) => {
  const newColumnOrder = { ...columnOrder };

  if (Object.keys(newColumnOrder).length === 0) {
    Object.entries(data).forEach(([id, column]) => {
      newColumnOrder[id] = column.order;
    });
  }

  const existingColumnId = Object.keys(newColumnOrder).find(id => newColumnOrder[id] === newOrder);

  if (existingColumnId) {
    newColumnOrder[existingColumnId] = newColumnOrder[columnId];
  }

  newColumnOrder[columnId] = newOrder;

  const sortedColumns = Object.entries(data)
    .map(([id, column]) => ({
      id,
      order: newColumnOrder[id] !== undefined ? newColumnOrder[id] : column.order,
    }))
    .sort((a, b) => a.order - b.order);

  const updatedOrder = sortedColumns.reduce((acc, { id, order }) => ({ ...acc, [id]: order }), {});
  setColumnOrder(updatedOrder);
  await updateColumnOrder(updatedOrder);
};