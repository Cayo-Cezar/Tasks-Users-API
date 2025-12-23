import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
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


  async update(id: number, dto: UpdateUserDto) {
    if (dto.name === undefined && dto.password === undefined) {
      throw new HttpException(
        'Nenhum campo enviado para atualização.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordHash = dto.password ? await this.hashingService.hash(dto.password) : undefined;
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          passwordHash: passwordHash,
          ...(dto.password !== undefined ? { passwordHash: passwordHash } : {}),
        },
        select: { id: true, name: true, email: true },
      });
    } catch {
      throw new HttpException(
        'Erro ao atualizar usuário. Verifique se o usuário existe.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
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
