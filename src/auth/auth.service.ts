import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const existentUser = await this.usersService.findByUserMail(email);

    if (
      existentUser &&
      bcrypt.compareSync(password, existentUser.userPassword)
    ) {
      const { ...result } = existentUser;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      userMail: user.userMail,
      username: user.username,
      userCpf: user.userCPF,
    };

    return {
      statusCode: 200,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
