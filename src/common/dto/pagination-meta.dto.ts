import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 0 })
  offset: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 5 })
  lastPage: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrevious: boolean;

  @ApiProperty({ example: 10, nullable: true })
  nextOffset: number | null;

  @ApiProperty({ example: 0, nullable: true })
  previousOffset: number | null;
}
