

export interface UserPayload {
  sub: number;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
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
  id: number;
  name: string;
  description?: string;
  users: User[];
  tasks: Task[];
  columns: Column[];
  created_at: string;
  updated_at: string;
}