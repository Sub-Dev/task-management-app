import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Column } from './column.entity';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Column]),
    forwardRef(() => ProjectsModule), // Resolva dependência circular com ProjectsModule
  ],
  providers: [ColumnsService],
  controllers: [ColumnsController],
  exports: [TypeOrmModule, ColumnsService],
})
export class ColumnsModule { }
