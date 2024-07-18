// src/users/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToMany(() => Project, project => project.users)
  @JoinTable()
  projects: Project[];

  @ManyToMany(() => Task, task => task.users)
  @JoinTable()
  tasks: Task[];

  @OneToMany(() => Task, task => task.created_by)
  tasks_created: Task[]; // Relacionamento para as tarefas criadas pelo usuário
}
