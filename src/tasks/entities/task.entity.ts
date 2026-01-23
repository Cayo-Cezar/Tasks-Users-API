import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Minha tarefa' })
  name: string;

  @ApiProperty({ example: 'Descrição da tarefa', nullable: true })
  description: string | null;

  @ApiProperty({ example: 1, nullable: true })
  userId: number | null;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: '2025-12-18T23:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-19T10:00:00.000Z' })
  updatedAt: Date;
}
