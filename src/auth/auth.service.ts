import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDto } from '../users/dto/user.dto';
import { TokenResponseDto } from '../common/dto/response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const existentUser = await this.usersService.findOneByUserMail(email);
    if (!existentUser) {
      throw new NotFoundException('Nenhum usuário encontrado :(');
    }

    if (!existentUser.isVerified) {
      const { accessToken } = await this.generateJWT(existentUser);
      const mail = {
        to: existentUser.email,
        from: 'noreply@bizudesign.com',
        subject: 'bizu design - Verifique seu e-mail!',
        template: 'email-confirmation',
        context: {
          accessToken,
        },
      };

      await this.mailerService.sendMail(mail);
      throw new UnauthorizedException('Usuário cadastrado mas não verificado.');
    }

    if (bcrypt.compareSync(password, existentUser.password) === false) {
      throw new UnauthorizedException('Senha inválida.');
    }

    const { ...result } = existentUser;
    return result;
  }

  // GERAÇÃO DO JWT. Utilizado dentro do login() de users.controller.ts:
  async generateJWT(user: UserDto): Promise<TokenResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      subscription: user.subscription,
      role: user.role,
    };

    return {
      statusCode: 200,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
