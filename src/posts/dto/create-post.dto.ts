import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Текст' })
  @IsNotEmpty()
  @MaxLength(512)
  body: string;

  @ApiProperty({ description: 'ID поста для відповіді', type: 'number' })
  @IsOptional()
  @IsNumber()
  replyToPostId?: number;
}
