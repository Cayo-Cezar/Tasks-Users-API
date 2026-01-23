import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

import { Task } from './entities/task.entity';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(
    paginationDto: PaginationDto = new PaginationDto(),
  ): Promise<PaginatedResponseDto<Task>> {
    const { limit, offset } = paginationDto;

    try {
      const [tasks, total] = await this.prisma.$transaction([
        this.prisma.task.findMany({
          take: limit,
          skip: offset,
          orderBy: { id: 'desc' },
        }),
        this.prisma.task.count(),
      ]);

      const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
      const lastPage = limit > 0 ? Math.ceil(total / limit) : 1;

      const hasNext = offset + limit < total;
      const hasPrevious = offset > 0;

      const nextOffset = hasNext ? offset + limit : null;
      const previousOffset = hasPrevious ? Math.max(offset - limit, 0) : null;

      return {
        data: tasks,
        meta: {
          total,
          offset,
          limit,
          currentPage,
          lastPage,
          hasNext,
          hasPrevious,
          nextOffset,
          previousOffset,
        },
      };
    } catch {
      throw new HttpException(
        'Erro ao listar tarefas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * findTask: usado para checar permissão (owner) no update/delete.
   * Retorna apenas o necessário para autorização.
   */
  async findTask(id: number): Promise<{ id: number; userId: number | null }> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!task) {
        throw new HttpException('Tarefa não encontrada.', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao buscar tarefa.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new HttpException('Essa tarefa não existe.', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao buscar tarefa.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(dto: CreateTaskDto, tokenPayload: PayLoadTokenDto): Promise<Task> {
    try {
      // Garantia forte: se o user não existir, você recebe erro claro (404)
      const userExists = await this.prisma.user.findUnique({
        where: { id: tokenPayload.sub },
        select: { id: true },
      });

      if (!userExists) {
        throw new HttpException('Usuário do token não existe.', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.task.create({
        data: {
          name: dto.name,
          description: dto.description ?? null,
          completed: false,

          // Forma mais robusta (relation):
          user: {
            connect: { id: tokenPayload.sub },
          },
        },
      });
    } catch (error: any) {
      // Loga o erro real para você diagnosticar rápido
      console.error('PRISMA CREATE TASK ERROR =>', error);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao criar tarefa. Verifique os dados enviados.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    tokenPayload: PayLoadTokenDto,
  ): Promise<Task> {
    const hasAnyField =
      dto.name !== undefined ||
      dto.description !== undefined ||
      dto.completed !== undefined;

    if (!hasAnyField) {
      throw new HttpException(
        'Nenhum campo enviado para atualização.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const task = await this.findTask(id);
    if (task.userId !== tokenPayload.sub) {
      throw new HttpException(
        'Você não tem permissão para atualizar esta tarefa.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return await this.prisma.task.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
        },
      });
    } catch (error: any) {
      console.error('PRISMA UPDATE TASK ERROR =>', error);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao atualizar tarefa. Verifique os dados enviados.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(
    id: number,
    tokenPayload: PayLoadTokenDto,
  ): Promise<{ message: string }> {
    const task = await this.findTask(id);
    if (task.userId !== tokenPayload.sub) {
      throw new HttpException(
        'Você não tem permissão para remover esta tarefa.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.prisma.task.delete({ where: { id } });
      return { message: 'Tarefa removida com sucesso.' };
    } catch (error: any) {
      console.error('PRISMA DELETE TASK ERROR =>', error);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao remover tarefa.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
