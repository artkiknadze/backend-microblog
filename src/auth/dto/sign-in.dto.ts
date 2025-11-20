import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'E-Mail користувача' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль користувача' })
  @IsNotEmpty()
  password: string;
}
