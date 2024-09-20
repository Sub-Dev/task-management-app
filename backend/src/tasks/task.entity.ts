import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from '../projects/project.entity';
import { Column as KanbanColumn } from '../columns/column.entity';

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ nullable: true })
  due_date: Date;

  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @ManyToMany(() => User, user => user.tasks)
  @JoinTable({
    name: 'user_tasks_task', 
    joinColumn: {
      name: 'taskId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToOne(() => User, user => user.tasks_created)
  created_by: User;

  @ManyToOne(() => KanbanColumn, column => column.tasks, {

    onDelete: 'CASCADE', 
  })
  column: KanbanColumn;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
