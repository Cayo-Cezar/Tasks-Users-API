import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<{
        name: string | null;
        id: number;
        email: string;
    }[]>;
    findOne(id: number): Promise<{
        name: string | null;
        id: number;
        Task: {
            description: string | null;
            name: string;
            userId: number | null;
            completed: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        email: string;
    }>;
    create(dto: CreateUserDto): Promise<{
        name: string | null;
        id: number;
        email: string;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        name: string | null;
        id: number;
        email: string;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
