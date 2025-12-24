import { Injectable, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) { }

  async authenticate(signInDto: SignInDto): Promise<{
    id: number;
    name: string | null;
    email: string;
    token: string;
  }> {
    const user = await this.prisma.user.findFirst({
      where: { email: signInDto.email },
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

    const token = await (this.jwtService as any).signAsync(
      { sub: user.id, email: user.email },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}