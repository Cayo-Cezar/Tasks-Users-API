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
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Task } from './entities/task.entity';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { tokenPayloadParm } from 'src/auth/parm/token-payload.parm';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) { }

  @Get()
  @ApiOperation({ summary: 'List tasks (with pagination)' })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    example: 0,
    description: 'Number of records to skip (offset)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of records to return (limit)',
  })
  @ApiOkResponse({ description: 'Paginated list of tasks' })
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.taskService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Task found', type: Task })
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @tokenPayloadParm() tokenPayload: PayLoadTokenDto,
  ) {
    if (!tokenPayload) {
      // isso vira um 500/400 mais claro, mas o ideal é nunca acontecer após a correção acima
      throw new Error('Token payload not found in request. Guard/decorator mismatch.');
    }
    return this.taskService.create(createTaskDto, tokenPayload);
  }


  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  @Patch(':id')
  @ApiOperation({ summary: 'Update task (partial PATCH)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: Task,
  })
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @tokenPayloadParm() tokenPayload: PayLoadTokenDto,
  ) {
    return this.taskService.update(id, updateTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    schema: { example: { message: 'Task deleted successfully.' } },
  })
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @tokenPayloadParm() tokenPayload: PayLoadTokenDto,
  ) {
    return this.taskService.delete(id, tokenPayload);
  }
}
