// src/interfaces/column.interface.ts

import { Task } from './task.interface';

export interface Column {
  id: number;               // Identificador único da coluna
  title: string;            // Título da coluna
  order: number;            // Ordem da coluna no Kanban
  project: number;          // ID do projeto ao qual a coluna pertence
  tasks: Task[];            // Lista de tarefas associadas à coluna
}
