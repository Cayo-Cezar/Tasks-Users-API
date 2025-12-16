import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  offset: number = 0;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit: number = 2;
}
