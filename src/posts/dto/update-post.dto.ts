import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ description: 'Текст' })
  @IsNotEmpty()
  body: string;
}
