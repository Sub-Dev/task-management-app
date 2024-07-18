// src/projects/project.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, user => user.projects)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Task, task => task.project)
  @JoinTable()
  tasks: Task[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
