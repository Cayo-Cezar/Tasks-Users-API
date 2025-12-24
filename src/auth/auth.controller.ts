import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  @ApiOperation({ summary: 'Autenticar usuário (login)' })
  @ApiBody({
    type: SignInDto,
    examples: {
      exemploPadrao: {
        summary: 'Exemplo de login',
        value: {
          email: 'usuario@example.com',
          password: 'minhasenha123',
        },
      },
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.authenticate(signInDto);
  }
}
