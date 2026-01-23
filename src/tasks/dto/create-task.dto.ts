import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Minha tarefa' })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ example: 'Descrição da tarefa', nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(5)
  readonly description?: string;
}
