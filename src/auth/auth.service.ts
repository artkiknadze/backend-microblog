import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findByEmail(signInDto.email, true);
    const isPasswordValid = await bcrypt.compare(signInDto.password, user?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
