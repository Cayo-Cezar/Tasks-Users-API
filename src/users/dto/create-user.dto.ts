// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Cayo Cezar', minLength: 1 })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'cayo@email.com', format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'minhasenha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
