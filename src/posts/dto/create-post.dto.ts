import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @MaxLength(512)
    body: string;

    @IsOptional()
    @IsNumber()
    replyToPostId?: number;
}
