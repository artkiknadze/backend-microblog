import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Аутентифікація користувача' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 201,
    description: 'Успішна аутентифікація',
    example: { access_token: 'string' },
  })
  @ApiResponse({
    status: 401,
    description: 'Невірний email або пароль',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Користувач не ввів email/пароль',
    example: {
      message: ['password should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
