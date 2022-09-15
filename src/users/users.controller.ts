import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Request,
  Param,
  Headers,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private mailerService: MailerService,
  ) {}

  // CADASTRAR USUÁRIO:
  @Post()
  async create(@Body() userToBeCreated: CreateUserDto) {
    const createdUser = await this.usersService.create(userToBeCreated);

    /* CASO OCORRA ERROS NO SIGN-UP: */
    if (Object.keys(createdUser).length === 2) {
      return createdUser;
    }

    const { accessToken } = await this.authService.generateJWT(
      createdUser as User,
    );

    /* ENVIO DO E-MAIL DE CONFIRMAÇÃO: */
    const { email } = createdUser as User;

    const mail = {
      to: email,
      from: 'noreply@bizudesign.com',
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        accessToken,
      },
    };

    return await this.mailerService
      .sendMail(mail)
      .then(() => {
        return {
          statusCode: 201,
          message:
            'Usuário criado com sucesso. Um e-mail de verificação foi enviado!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao enviar e-mail para confirmação cadastral - ${error}`,
        };
      });
  }

  // VERIFICAR USUÁRIO:
  @Get('verify/:token')
  async verifyUser(@Param('token') token: string) {
    return await this.usersService.verifyUser(token);
  }

  // LOGIN DO USUÁRIO:
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { accessToken } = await this.authService.generateJWT(req.user);

    await this.usersService.updateLastSignIn(accessToken); // Atualiza a coluna lastSignIn.
    return await this.authService.generateJWT(req.user);
  }

  // ATUALIZAR USUÁRIO:
  @UseGuards(JwtAuthGuard) // O endpoint abaixo só será acessado ao enviar um token válido.
  @Patch('current')
  async update(
    @Headers('Authorization') authorization: string,
    @Body() data: Partial<UpdateUserDto>,
  ) {
    const token = authorization.replace('Bearer ', '');
    return await this.usersService.update(token, data);
  }

  // BUSCAR USUÁRIO POR TOKEN --> id do usuário:
  @UseGuards(JwtAuthGuard)
  @Get('current')
  async findOneByUserToken(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    return await this.usersService.findOneByUserToken(token);
  }

  // DELETAR USUÁRIO:
  @UseGuards(JwtAuthGuard)
  @Delete('current')
  async destroy(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    return await this.usersService.destroy(token);
  }
}
