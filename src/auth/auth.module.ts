import { Module, Global } from '@nestjs/common';
import { BcryptService } from './hash/bcrypt.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
    AuthService
  ],
  exports: [HashingServiceProtocol],
  controllers: [AuthController],
})
export class AuthModule { }
