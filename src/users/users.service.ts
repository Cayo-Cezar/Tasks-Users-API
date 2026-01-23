import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
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
        select: {
          id: true,
          name: true,
          email: true,
          // Se quiser listar tasks, melhor selecionar campos seguros:
          Task: {
            select: {
              id: true,
              name: true,
              description: true,
              completed: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!user) {
        throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
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
          passwordHash,
        },
        select: { id: true, name: true, email: true },
      });
    } catch {
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

    if (tokenPayload.sub !== id) {
      throw new HttpException(
        'Você não tem permissão para atualizar este usuário.',
        HttpStatus.FORBIDDEN,
      );
    }

    // garante 404 se não existir
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    try {
      const data: Record<string, any> = {};

      if (dto.name !== undefined) data.name = dto.name;
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
        'Erro ao atualizar usuário.',
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
