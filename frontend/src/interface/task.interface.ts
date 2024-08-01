// src/interfaces/task.interface.ts

export interface Task {
  id: number;                    // Identificador único da tarefa
  title: string;                 // Título da tarefa
  description?: string;          // Descrição opcional da tarefa
  status: 'pending' | 'completed'; // Status da tarefa como enum
  due_date?: string;             // Data de vencimento da tarefa
  project?: number;              // ID do projeto ao qual a tarefa pertence
  users?: number[];              // IDs dos usuários associados à tarefa
  created_by?: number;           // ID do usuário que criou a tarefa
  column: number;                // ID da coluna do Kanban em que a tarefa está
  created_at: string;            // Data de criação da tarefa
  updated_at: string;            // Data de atualização da tarefa
}
