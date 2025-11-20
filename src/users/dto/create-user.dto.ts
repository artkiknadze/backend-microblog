import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({description: "username користувача"})
    @IsAlphanumeric()
    @MinLength(6)
    @MaxLength(20)
    username: string;
    
    @ApiProperty({description: "Ім'я користувача"})
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(2)
    displayName: string;
    
    @ApiProperty({description: "E-Mail користувача"})
    @IsEmail()
    email: string;
    
    @ApiProperty({description: "Пароль користувача"})
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @ApiProperty({description: "Перевірка паролю користувача"})
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    confirmPassword: string;
}
