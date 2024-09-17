import { DropResult } from 'react-beautiful-dnd';
import api from "../../../../axiosInstance.js";
import { Column } from '../interface/Interfaces.tsx'; // Ajuste os caminhos conforme necessário

export const onDragEnd = async (
  result: DropResult,
  data: Record<string, Column>,
  setData: React.Dispatch<React.SetStateAction<Record<string, Column>>>
) => {
  const { source, destination, draggableId, type } = result;

  if (!destination) return;

  if (type === 'COLUMN') {
    // Lógica de reorganização das colunas
    const reorderedColumns = Array.from(Object.values(data));
    const [movedColumn] = reorderedColumns.splice(source.index, 1);
    reorderedColumns.splice(destination.index, 0, movedColumn);

    const newData = reorderedColumns.reduce((acc: Record<string, Column>, column) => {
      acc[column.id] = column;
      return acc;
    }, {});
    setData(newData);

    try {
      for (let i = 0; i < reorderedColumns.length; i++) {
        const column = reorderedColumns[i];
        await api.put(`/columns/${column.id}`, { order: i + 1 });
        column.order = i + 1;
      }
    } catch (error) {
      console.error('Erro ao atualizar a ordem das colunas:', error);
    }
  } else {
    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    if (sourceColumnId === destColumnId) {
      return;
    }

    const sourceColumn = data[sourceColumnId];
    const destColumn = data[destColumnId];

    const updatedSourceItems = [...sourceColumn.tasks];
    const updatedDestItems = [...destColumn.tasks];

    const [movedTask] = updatedSourceItems.splice(source.index, 1);
    updatedDestItems.splice(destination.index, 0, movedTask);

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

    try {
      const token = localStorage.getItem('token');

      await api.put(`/tasks/${draggableId}`, { column: Number(destColumnId) }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);

      setData((prevData) => ({
        ...prevData,
        [sourceColumnId]: {
          ...sourceColumn,
          tasks: [...updatedSourceItems.slice(0, source.index), movedTask, ...updatedSourceItems.slice(source.index)],
        },
        [destColumnId]: {
          ...destColumn,
          tasks: updatedDestItems.filter(task => task.id !== draggableId),
        },
      }));
    }
  }
};
