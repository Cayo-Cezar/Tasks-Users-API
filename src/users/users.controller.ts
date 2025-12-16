import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';

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
          name: 'Caio Cezar',
          email: 'caio@email.com',
          password: 'minhasenha123',
        },
      },
    },
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário (name e/ou password). Email não pode ser alterado.',
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
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID do usuário',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
