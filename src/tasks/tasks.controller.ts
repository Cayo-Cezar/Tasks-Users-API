import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthAdminGuard } from 'src/common/guards/admin.guards';
import { Task } from './entities/task.entity';

@ApiTags('Tasks')
@Controller('tasks')
//@UseGuards(AuthAdminGuard)
export class TasksController {
  constructor(private readonly taskService: TasksService) { }

  @Get()
  @ApiOperation({ summary: 'Listar tarefas (com paginação)' })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    example: 0,
    description: 'Quantidade de registros a pular (offset)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade de registros retornados (limit)',
  })
  @ApiOkResponse({
    description: 'Lista paginada de tarefas',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'Minha tarefa',
            description: 'Descrição da tarefa',
            completed: false,
            createdAt: '2025-12-18T23:00:00.000Z',
          },
        ],
        meta: {
          total: 20,
          offset: 0,
          limit: 10,
          currentPage: 1,
          lastPage: 2,
          hasNext: true,
          hasPrevious: false,
          nextOffset: 10,
          previousOffset: null,
        },
      },
    },
  })
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.taskService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Tarefa encontrada', type: Task })
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar tarefa' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
    type: Task,
  })
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tarefa (PATCH parcial)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'Tarefa atualizada com sucesso',
    type: Task,
  })
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover tarefa' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Tarefa removida com sucesso',
    schema: {
      example: { message: 'Tarefa removida com sucesso.' },
    },
  })
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }
}
