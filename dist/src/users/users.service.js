"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const hashing_service_1 = require("../auth/hash/hashing.service");
let UsersService = class UsersService {
    prisma;
    hashingService;
    constructor(prisma, hashingService) {
        this.prisma = prisma;
        this.hashingService = hashingService;
    }
    async getAllUsers() {
        try {
            return await this.prisma.user.findMany({
                select: { id: true, name: true, email: true },
            });
        }
        catch {
            throw new common_1.HttpException('Erro ao buscar usuários.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const user = await this.prisma.user.findFirst({
                where: { id },
                select: { id: true, name: true, email: true, Task: true, passwordHash: true },
            });
            if (!user) {
                throw new common_1.HttpException('Usuário não encontrado.', common_1.HttpStatus.NOT_FOUND);
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Erro ao buscar usuário.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(dto) {
        try {
            const passwordHash = await this.hashingService.hash(dto.password);
            return await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    passwordHash: passwordHash,
                },
                select: { id: true, name: true, email: true },
            });
        }
        catch (error) {
            console.error('PRISMA CREATE USER ERROR =>', error);
            throw new common_1.HttpException('Erro ao criar usuário. Verifique os dados enviados.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, dto) {
        if (dto.name === undefined && dto.password === undefined) {
            throw new common_1.HttpException('Nenhum campo enviado para atualização.', common_1.HttpStatus.BAD_REQUEST);
        }
        const passwordHash = dto.password ? await this.hashingService.hash(dto.password) : undefined;
        try {
            return await this.prisma.user.update({
                where: { id },
                data: {
                    ...(dto.name !== undefined ? { name: dto.name } : {}),
                    passwordHash: passwordHash,
                    ...(dto.password !== undefined ? { passwordHash: passwordHash } : {}),
                },
                select: { id: true, name: true, email: true },
            });
        }
        catch {
            throw new common_1.HttpException('Erro ao atualizar usuário. Verifique se o usuário existe.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({ where: { id } });
            return { message: 'Usuário removido com sucesso.' };
        }
        catch {
            throw new common_1.HttpException('Erro ao remover usuário. Verifique se o usuário existe ou possui vínculos.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        hashing_service_1.HashingServiceProtocol])
], UsersService);
//# sourceMappingURL=users.service.js.map