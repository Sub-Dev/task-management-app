

export interface UserPayload {
  sub: number;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed"; // Status limitado a 'pending' ou 'completed'
  users: number[];
  due_date?: string;
  project?: number;
  column: number;
}
export interface Column {
  id: number;
  title: string;
  order: number;
  tasks: Task[];
  project: Project;
}
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  profileImageUrl: string;
}
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