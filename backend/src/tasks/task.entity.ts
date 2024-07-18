// src/tasks/task.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from '../projects/project.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 'medium' })
  priority: string;

  @Column({ nullable: true })
  due_date: Date;

  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @ManyToMany(() => User, user => user.tasks)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, user => user.tasks_created)
  created_by: User;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
