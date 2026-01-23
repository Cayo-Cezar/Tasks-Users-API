import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  @ApiOperation({ summary: 'Authenticate user (login)' })
  @ApiBody({
    type: SignInDto,
    examples: {
      defaultExample: {
        summary: 'Login example',
        value: {
          email: 'user@example.com',
          password: 'mypassword123',
        },
      },
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.authenticate(signInDto);
  }
}
