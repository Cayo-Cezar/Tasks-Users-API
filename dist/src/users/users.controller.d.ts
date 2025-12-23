import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';
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
        passwordHash: string;
    }>;
    createUser(createUserDto: CreateUserDto): Promise<{
        name: string | null;
        id: number;
        email: string;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<{
        name: string | null;
        id: number;
        email: string;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
