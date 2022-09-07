import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { TokenResponseDto } from '../common/dto/response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const existentUser = await this.usersService.findOneByUserMail(email);

    if (existentUser && bcrypt.compareSync(password, existentUser.password)) {
      const { ...result } = existentUser;
      return result;
    }

    return null;
  }

  // LOGIN DO USUÁRIO. Utilizado dentro do login() de users.controller.ts:
  async login(user: UserDto): Promise<TokenResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return {
      statusCode: 200,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
