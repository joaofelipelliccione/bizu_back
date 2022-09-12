import {
  Controller,
  UseGuards,
  Post,
  Patch,
  Get,
  Delete,
  Request,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  // CADASTRAR USUÁRIO:
  @Post()
  async create(@Body() newUser: CreateUserDto) {
    return await this.usersService.create(newUser);
  }

  // LOGIN DO USUÁRIO:
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { accessToken } = await this.authService.login(req.user);

    await this.usersService.updateLastSignIn(accessToken); // Atualiza a coluna lastSignIn.
    return await this.authService.login(req.user);
  }

  // ATUALIZAR USUÁRIO:
  @UseGuards(JwtAuthGuard) // O endpoint abaixo só será acessado ao enviar um token válido.
  @Patch('current/update')
  async update(
    @Headers('Authorization') authorization: string,
    @Body() data: Partial<UpdateUserDto>,
  ) {
    const token = authorization.replace('Bearer ', '');
    return await this.usersService.update(token, data);
  }

  // BUSCAR USUÁRIO POR TOKEN --> id do usuário:
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async findOneByUserToken(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    return await this.usersService.findOneByUserToken(token);
  }

  // DELETAR USUÁRIO:
  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async destroy(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    return await this.usersService.destroy(token);
  }
}
