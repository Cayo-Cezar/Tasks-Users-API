import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private readonly hashingService: HashingServiceProtocol) { }


  async authenticate(signInDto: SignInDto): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.hashingService.compare(
      signInDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return isPasswordValid;
  }
}