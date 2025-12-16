import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
export declare class TasksController {
    private readonly taskService;
    constructor(taskService: TasksService);
    findAllTasks(paginationDto: PaginationDto): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOneTask(id: number): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createTask(createTaskDto: CreateTaskDto): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTask(id: number): Promise<{
        message: string;
    }>;
}
