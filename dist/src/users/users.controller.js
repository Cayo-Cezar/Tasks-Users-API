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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const auth_token_guard_1 = require("../auth/guard/auth-token.guard");
const token_payload_parm_1 = require("../auth/parm/token-payload.parm");
const payload_token_dto_1 = require("../auth/dto/payload-token.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAllUsers() {
        return this.usersService.getAllUsers();
    }
    findOneUser(id) {
        return this.usersService.findOne(id);
    }
    createUser(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    updateUser(id, updateUserDto, tokenPayload) {
        return this.usersService.update(id, updateUserDto, tokenPayload);
    }
    delete(id, tokenPayload) {
        return this.usersService.delete(id, tokenPayload);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        example: 1,
        description: 'User ID',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOneUser", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create user' }),
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
        examples: {
            defaultExample: {
                summary: 'User creation example',
                value: {
                    name: 'Full Name',
                    email: 'user@email.com',
                    password: 'mypassword123',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid or missing token' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user (name and/or password). Email cannot be changed.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        example: 1,
        description: 'User ID',
    }),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        examples: {
            updateName: {
                summary: 'Update name only',
                value: { name: 'New Name' },
            },
            updatePassword: {
                summary: 'Update password only',
                value: { password: 'newpassword123' },
            },
            updateBoth: {
                summary: 'Update name and password',
                value: { name: 'New Name', password: 'newpassword123' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, token_payload_parm_1.tokenPayloadParm)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto,
        payload_token_dto_1.PayLoadTokenDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid or missing token' }),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        example: 1,
        description: 'User ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, token_payload_parm_1.tokenPayloadParm)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, payload_token_dto_1.PayLoadTokenDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map