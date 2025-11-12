import { IsAlphanumeric, IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsAlphanumeric()
    @MinLength(6)
    @MaxLength(20)
    username: string;
    
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(2)
    displayName: string;
    
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    confirmPassword: string;
}
