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

  @Column({ nullable: true }) // Permite que o campo seja opcional
  profileImageUrl: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  currentSessionToken: string | null;
  
  @ManyToMany(() => Project, project => project.users)
  @JoinTable({
    name: 'user_projects_project',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'projectId',
      referencedColumnName: 'id',
    },
  })
  projects: Project[];

  @ManyToMany(() => Task, task => task.users)
  tasks: Task[];

  @OneToMany(() => Task, task => task.created_by)
  tasks_created: Task[];
}
