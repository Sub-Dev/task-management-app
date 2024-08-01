// src/interfaces/project.interface.ts

import { User } from './user.interface';  // Importa a interface User
import { Task } from './task.interface';  // Importa a interface Task
import { Column } from './column.interface';  // Importa a interface Column

export interface Project {
  id: number;               // Identificador único do projeto
  name: string;             // Nome do projeto
  description?: string;     // Descrição opcional do projeto
  users: User[];            // Usuários associados ao projeto
  tasks: Task[];            // Tarefas associadas ao projeto
  columns: Column[];        // Colunas Kanban associadas ao projeto
  created_at: string;       // Data de criação do projeto
  updated_at: string;       // Data de atualização do projeto
}
