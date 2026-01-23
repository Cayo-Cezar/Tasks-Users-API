import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        name: string | null;
        id: number;
        email: string;
    }[]>;
    findOneUser(id: number): Promise<{
        name: string | null;
        id: number;
        email: string;
        Task: {
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            completed: boolean;
            updatedAt: Date;
        }[];
    }>;
    createUser(createUserDto: CreateUserDto): Promise<{
        name: string | null;
        id: number;
        email: string;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto, tokenPayload: PayLoadTokenDto): Promise<{
        name: string | null;
        id: number;
        email: string;
    }>;
    delete(id: number, tokenPayload: PayLoadTokenDto): Promise<{
        message: string;
    }>;
}
