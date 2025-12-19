import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { MiddlewareConsumer, NestModule, RequestMethod, Module } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TasksModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthAdminGuard,
    // }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}