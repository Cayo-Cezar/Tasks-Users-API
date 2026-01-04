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
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/common/auth.constants';
import { tokenPayloadParm } from 'src/auth/parm/token-payload.parm';
import { PayLoadTokenDto } from 'src/auth/dto/payload-token.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID do usuário',
  })
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      exemploPadrao: {
        summary: 'Exemplo de criação de usuário',
        value: {
          name: 'Nome Sobrenome',
          email: 'nome@email.com',
          password: 'minhasenha123',
        },
      },
    },
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  @ApiOperation({
    summary:
      'Atualizar usuário (name e/ou password). Email não pode ser alterado.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID do usuário',
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      atualizarNome: {
        summary: 'Atualizar apenas nome',
        value: {
          name: 'Novo Nome',
        },
      },
      atualizarSenha: {
        summary: 'Atualizar apenas senha',
        value: {
          password: 'novasenha123',
        },
      },
      atualizarAmbos: {
        summary: 'Atualizar nome e senha',
        value: {
          name: 'Novo Nome',
          password: 'novasenha123',
        },
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

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID do usuário',
  })
  @UseGuards(AuthTokenGuard)
  delete(@Param('id', ParseIntPipe) id: number, @tokenPayloadParm() tokenPayload: PayLoadTokenDto) {
    return this.usersService.delete(id, tokenPayload);
  }
}
