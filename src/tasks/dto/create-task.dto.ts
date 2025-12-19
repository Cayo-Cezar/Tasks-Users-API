import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Minha tarefa' })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Descrição da tarefa' })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}
