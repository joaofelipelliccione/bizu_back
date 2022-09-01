import {
  Controller,
  Get,
  Post,
  Patch,
  Request,
  Body,
  Headers,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  // CADASTRAR USUÁRIO:
  @Post('new')
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  // LOGIN DO USUÁRIO:
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { accessToken } = await this.authService.login(req.user);

    this.usersService.updateLastSignIn(accessToken); // Atualiza a coluna lastSignIn.
    return this.authService.login(req.user);
  }

  // ATUALIZAR USUÁRIO:
  @UseGuards(JwtAuthGuard) // O endpoint abaixo só será acessado ao enviar um token válido.
  @Patch('update')
  async update(
    @Headers('Authorization') authorization: string,
    @Body() data: Partial<UpdateUserDto>,
  ) {
    const token = authorization.replace('Bearer ', '');
    return this.usersService.update(token, data);
  }

  // BUSCAR USUÁRIO POR TOKEN --> userId:
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async findOne(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    return this.usersService.findUserByToken(token);
  }

  // DELETAR USUÁRIO:
  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async destroy(@Headers('Authorization') authorization: string) {
    const token = authorization.replace('Bearer ', '');
    return this.usersService.destroy(token);
  }
}
