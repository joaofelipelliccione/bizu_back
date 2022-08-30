import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto | null> {
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

  async login(user: UserDto) {
    const payload = {
      sub: user.userId,
      userMail: user.userMail,
      username: user.username,
    };

    return {
      statusCode: 200,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
