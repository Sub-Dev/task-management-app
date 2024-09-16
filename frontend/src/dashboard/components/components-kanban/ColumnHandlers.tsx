import api from "../../../axiosInstance";
import { Column } from './Interfaces.tsx';
import { Dispatch, SetStateAction } from 'react';

interface HandleAddColumnParams {
  newColumnName: string;
  projectId: number | undefined;
  data: Record<string, Column>;
  setData: (data: Record<string, Column>) => void;
  setNewColumnName: (name: string) => void;
  setIsColumnModalOpen: (isOpen: boolean) => void;
}

export const handleAddColumn = async ({
  newColumnName,
  projectId,
  data,
  setData,
  setNewColumnName,
  setIsColumnModalOpen
}: HandleAddColumnParams) => {
  if (!newColumnName || !projectId) return;

  try {
    const response = await api.post('/columns', { title: newColumnName, projectId });
    const addedColumn = response.data;

    const updatedData = {
      ...data,
      [addedColumn.id]: { ...addedColumn, order: Object.keys(data).length },
    };

    setData(updatedData);
    setNewColumnName('');
  } catch (error) {
    console.error('Erro ao adicionar coluna:', error);
  }

  setIsColumnModalOpen(false);
};

interface HandleDeleteColumnParams {
  columnToDelete: number | null;
  setData: (data: Record<string, Column>) => void;
  setOpenDeleteColumnDialog: (isOpen: boolean) => void;
}

export const handleDeleteColumnConfirm = async ({
  columnToDelete,
  setData,
  setOpenDeleteColumnDialog,
}: HandleDeleteColumnParams) => {
  if (columnToDelete) {
    try {
      // Converta columnToDelete para número se ele for string
      const columnId = typeof columnToDelete === 'string' ? parseInt(columnToDelete, 10) : columnToDelete;

      await api.delete(`/columns/${columnId}`);

      const response = await api.get('/columns');
      const updatedColumns = response.data;

      setData(
        updatedColumns.reduce((acc: Record<string, Column>, column: Column) => {
          acc[column.id] = column;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('Erro ao deletar coluna:', error);
    }

    setOpenDeleteColumnDialog(false);
  }
};


export const handleUpdateColumn = async (
  currentColumn: Column | null,
  setData: Dispatch<SetStateAction<Record<string, Column>>>,
  setIsColumnModalOpen: Dispatch<SetStateAction<boolean>>
) => {
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
