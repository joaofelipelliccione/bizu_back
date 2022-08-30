import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users') // Nome da rota
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('new') // Rota --> /user/new
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(LocalAuthGuard) // O endpoint abaixo só será acessado quando receber uma requisição de login válida.
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
