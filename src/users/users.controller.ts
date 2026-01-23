import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { tokenPayloadParm } from 'src/auth/parm/token-payload.parm';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'List users' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'User ID',
  })
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    type: CreateUserDto,
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
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user (name and/or password). Email cannot be changed.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'User ID',
  })
  @ApiBody({
    type: UpdateUserDto,
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
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @tokenPayloadParm() tokenPayload: PayLoadTokenDto,
  ) {
    return this.usersService.update(id, updateUserDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @tokenPayloadParm() tokenPayload: PayLoadTokenDto,
  ) {
    return this.usersService.delete(id, tokenPayload);
  }
}
