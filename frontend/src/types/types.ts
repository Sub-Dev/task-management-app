// types.ts

export interface Task {
  id: string;                // ID único para a tarefa
  title: string;             // Título da tarefa
  description: string;       // Descrição da tarefa
  completed: boolean;        // Status de conclusão da tarefa
  column: string;          // ID da coluna à qual a tarefa pertence
}

export interface Column {
  id: string;                // ID único para a coluna
  title: string;             // Título da coluna
  order: number;             // Ordem da coluna para fins de ordenação
  tasks: Task[];             // Lista de tarefas dentro da coluna
}
