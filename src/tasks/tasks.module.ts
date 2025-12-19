import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService,
    {
      provide: 'KEY_TOKEN',
      useValue: 'TOKEN_123456'
    }

  ]
})
export class TasksModule { }
