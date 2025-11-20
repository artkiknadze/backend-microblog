import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
    @ApiProperty({description: "Текст"})
    @IsNotEmpty()
    body: string;
}
