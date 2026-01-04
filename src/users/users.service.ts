import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol
  ) { }

  async getAllUsers() {
    try {
      return await this.prisma.user.findMany({
        select: { id: true, name: true, email: true },
      });
    } catch {
      throw new HttpException(
        'Erro ao buscar usuários.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
        select: { id: true, name: true, email: true, Task: true, passwordHash: true },
      });

      if (!user) {
        throw new HttpException(
          'Usuário não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao buscar usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(dto.password);
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash: passwordHash,
        },
        select: { id: true, name: true, email: true },
      });
    } catch (error) {
      console.error('PRISMA CREATE USER ERROR =>', error);
      throw new HttpException(
        'Erro ao criar usuário. Verifique os dados enviados.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  async update(id: number, dto: UpdateUserDto, tokenPayload: PayLoadTokenDto) {
    if (dto.name === undefined && dto.password === undefined) {
      throw new HttpException(
        'Nenhum campo enviado para atualização.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Permissão: só o próprio usuário (sub) pode atualizar seu registro
    if (tokenPayload.sub !== id) {
      throw new HttpException(
        'Você não tem permissão para atualizar este usuário.',
        HttpStatus.FORBIDDEN,
      );
    }

    // (Opcional, mas mantém seu padrão) garante 404 se não existir
    await this.findOne(id);

    try {
      const data: any = {};

      if (dto.name !== undefined) {
        data.name = dto.name;
      }

      if (dto.password !== undefined) {
        data.passwordHash = await this.hashingService.hash(dto.password);
      }

      return await this.prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true },
      });
    } catch {
      throw new HttpException(
        'Erro ao atualizar usuário. Verifique se o usuário existe.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  async delete(id: number, tokenPayload: PayLoadTokenDto) {
    if (tokenPayload.sub !== id) {
      throw new HttpException(
        'Você não tem permissão para remover este usuário.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'Usuário removido com sucesso.' };
    } catch {
      throw new HttpException(
        'Erro ao remover usuário. Verifique se o usuário existe ou possui vínculos.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
