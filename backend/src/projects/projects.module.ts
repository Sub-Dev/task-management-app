import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { ColumnsModule } from '../columns/columns.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User]),
    forwardRef(() => UserModule), // Resolva dependência circular com UserModule
    forwardRef(() => ColumnsModule), // Resolva dependência circular com ColumnsModule
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [TypeOrmModule, ProjectsService],
})
export class ProjectsModule { }
