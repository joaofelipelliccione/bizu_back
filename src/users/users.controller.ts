import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Request,
  Response,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import 'dotenv/config';

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
      .catch(async (error) => {
        await this.usersService.destroy(accessToken);
        return {
          statusCode: 500,
          message: `Criação de conta mal-sucedida. Houve um erro ao enviar e-mail para confirmação cadastral - ${error}`,
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
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const { accessToken } = await this.authService.generateJWT(req.user);
    const initial = new Date();
    const today = new Date(initial);

    // Salvando o token do usuário em um cookie httpOnly.
    res.cookie('accessToken', accessToken, {
      expires: new Date(today.setDate(today.getDate() + 1)), // Expira em 1 dia
      sameSite: 'strict',
      httpOnly: true,
    });

    await this.usersService.updateLastSignIn(accessToken); // Atualiza a coluna lastSignIn.
    return { msg: `Login realizado com sucesso - Token: ${accessToken}` };
  }

  // ATUALIZAR USUÁRIO:
  @Patch('current')
  async update(@Request() req, @Body() data: Partial<UpdateUserDto>) {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new UnauthorizedException();
    }

    return await this.usersService.update(token, data);
  }

  // BUSCAR USUÁRIO POR TOKEN --> id do usuário:
  @Get('current')
  async findOneByUserToken(@Request() req) {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new UnauthorizedException();
    }

    return await this.usersService.findOneByUserToken(token);
  }

  // DELETAR USUÁRIO:
  @Delete('current')
  async destroy(@Request() req) {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new UnauthorizedException();
    }

    return await this.usersService.destroy(token);
  }
}
