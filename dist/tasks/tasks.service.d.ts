import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(paginationDto?: PaginationDto): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateTaskDto): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateTaskDto): Promise<{
        description: string | null;
        name: string;
        userId: number | null;
        completed: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
