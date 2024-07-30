import {
  Entity,
  PrimaryGeneratedColumn,
  Column as DbColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Project } from '../projects/project.entity';

@Entity()
export class Column extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @DbColumn()
  title: string;

  @DbColumn({ default: 0 })
  order: number;

  @ManyToOne(() => Project, project => project.columns, { onDelete: 'CASCADE' })
  project: Project;

  @OneToMany(() => Task, (task) => task.column, { cascade: true })
  tasks: Task[];
}
