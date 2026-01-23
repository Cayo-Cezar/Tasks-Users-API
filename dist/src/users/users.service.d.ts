import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly hashingService;
    constructor(prisma: PrismaService, hashingService: HashingServiceProtocol);
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
    update(id: number, dto: UpdateUserDto, tokenPayload: PayLoadTokenDto): Promise<{
        name: string | null;
        id: number;
        email: string;
    }>;
    delete(id: number, tokenPayload: PayLoadTokenDto): Promise<{
        message: string;
    }>;
}
