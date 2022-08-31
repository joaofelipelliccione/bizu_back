import {
  Controller,
  Get,
  Post,
  Patch,
  Request,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('users') // Nome da rota base
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @UseGuards(JwtAuthGuard) // O endpoint abaixo só será acessado ao enviar um token válido.
  @Patch(':token')
  async update(
    @Param('token') token: string,
    @Body() data: Partial<UpdateUserDto>,
  ) {
    return this.usersService.update(token, data);
  }

  @UseGuards(LocalAuthGuard) // O endpoint abaixo só será acessado ao receber uma requisição de login válida.
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
