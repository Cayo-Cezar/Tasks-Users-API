import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Quantidade de registros a pular (offset)',
    example: 0,
    minimum: 0,
    maximum: 50,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  offset: number = 0;

  @ApiPropertyOptional({
    description: 'Quantidade de registros retornados (limit)',
    example: 10,
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit: number = 10;
}
