// src/projects/project.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../tasks/task.entity';
import { Column as KanbanColumn } from '../columns/column.entity'; // Importar a entidade Column com alias

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.projects,{
    onDelete: 'CASCADE',
  })
  users: User[];

  @OneToMany(() => Task, task => task.project) // Relacionamento OneToMany com Task
  tasks: Task[];

  @OneToMany(() => KanbanColumn, column => column.project)  // Relacionamento OneToMany com Column
  columns: KanbanColumn[];  // Tipo KanbanColumn[]

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
