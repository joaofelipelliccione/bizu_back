import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const existentUser = await this.authService.validateUser(
      username,
      password,
    );

    if (!existentUser) {
      throw new UnauthorizedException(
        'Login não realizado. E-mail e/ou senha inválidas.',
      );
    }
    return existentUser;
  }
}
