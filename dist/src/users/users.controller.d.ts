import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        id: number;
        email: string;
        name: string | null;
    }[]>;
    findOneUser(id: number): Promise<{
        id: number;
        email: string;
        name: string | null;
        passwordHash: string;
        Task: {
            id: number;
            name: string;
            createdAt: Date;
            description: string | null;
            completed: boolean;
            updatedAt: Date;
            userId: number | null;
        }[];
    }>;
    createUser(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        name: string | null;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto, tokenPayload: PayLoadTokenDto): Promise<{
        id: number;
        email: string;
        name: string | null;
    }>;
    delete(id: number, tokenPayload: PayLoadTokenDto): Promise<{
        message: string;
    }>;
}
