import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

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

  async findOne(id: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new HttpException(
          'Essa tarefa não existe.',
          HttpStatus.NOT_FOUND,
        );
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

  async create(dto: CreateTaskDto) {
    try {
      return await this.prisma.task.create({
        data: {
          name: dto.name,
          description: dto.description,
          completed: false,
          userId: dto.userId,
        },
      });
    } catch {
      // aqui pode falhar por userId inválido (FK) ou validação do banco
      throw new HttpException(
        'Erro ao criar tarefa. Verifique os dados enviados (ex.: userId).',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, dto: UpdateTaskDto) {
    const hasAnyField =
      dto.name !== undefined ||
      dto.description !== undefined ||
      dto.completed !== undefined ||
      dto.userId !== undefined;

    if (!hasAnyField) {
      throw new HttpException(
        'Nenhum campo enviado para atualização.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const exists = await this.prisma.task.findUnique({ where: { id } });
      if (!exists) {
        throw new HttpException(
          'Essa tarefa não existe.',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.prisma.task.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
          ...(dto.userId !== undefined ? { userId: dto.userId } : {}),
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao atualizar tarefa. Verifique os dados enviados.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    try {
      const exists = await this.prisma.task.findUnique({ where: { id } });
      if (!exists) {
        throw new HttpException(
          'Essa tarefa não existe.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.task.delete({ where: { id } });

      return { message: 'Tarefa removida com sucesso.' };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Erro ao remover tarefa.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
