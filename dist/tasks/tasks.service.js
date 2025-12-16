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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../src/prisma/prisma.service");
const pagination_dto_1 = require("../src/common/dto/pagination.dto");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(paginationDto = new pagination_dto_1.PaginationDto()) {
        const { limit, offset } = paginationDto;
        try {
            return await this.prisma.task.findMany({
                take: limit,
                skip: offset,
                orderBy: { id: 'desc' },
            });
        }
        catch {
            throw new common_1.HttpException('Erro ao listar tarefas.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id },
            });
            if (!task) {
                throw new common_1.HttpException('Essa tarefa não existe.', common_1.HttpStatus.NOT_FOUND);
            }
            return task;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Erro ao buscar tarefa.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(dto) {
        try {
            return await this.prisma.task.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    completed: false,
                    userId: dto.userId,
                },
            });
        }
        catch {
            throw new common_1.HttpException('Erro ao criar tarefa. Verifique os dados enviados (ex.: userId).', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, dto) {
        const hasAnyField = dto.name !== undefined ||
            dto.description !== undefined ||
            dto.completed !== undefined ||
            dto.userId !== undefined;
        if (!hasAnyField) {
            throw new common_1.HttpException('Nenhum campo enviado para atualização.', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const exists = await this.prisma.task.findUnique({ where: { id } });
            if (!exists) {
                throw new common_1.HttpException('Essa tarefa não existe.', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.prisma.task.update({
                where: { id },
                data: {
                    ...(dto.name !== undefined ? { name: dto.name } : {}),
                    ...(dto.description !== undefined ? { description: dto.description } : {}),
                    ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
                    ...(dto.userId !== undefined ? { userId: dto.userId } : {}),
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Erro ao atualizar tarefa. Verifique os dados enviados.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete(id) {
        try {
            const exists = await this.prisma.task.findUnique({ where: { id } });
            if (!exists) {
                throw new common_1.HttpException('Essa tarefa não existe.', common_1.HttpStatus.NOT_FOUND);
            }
            await this.prisma.task.delete({ where: { id } });
            return { message: 'Tarefa removida com sucesso.' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Erro ao remover tarefa.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map