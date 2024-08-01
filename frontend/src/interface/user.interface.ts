// src/interfaces/user.interface.ts

import { Project } from './project.interface';  // Importa a interface Project
import { Task } from './task.interface';  // Importa a interface Task

export interface User {
  id: number;                // Identificador único do usuário
  username: string;          // Nome de usuário único
  email: string;             // Email único do usuário
  password: string;          // Senha do usuário
  created_at: string;        // Data de criação do usuário
  updated_at: string;        // Data de atualização do usuário
  projects: Project[];       // Projetos associados ao usuário
  tasks: Task[];             // Tarefas associadas ao usuário
  tasks_created: Task[];     // Tarefas criadas pelo usuário
}
