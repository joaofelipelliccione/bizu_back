import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { ScreensService } from './screens.service';
import { CreateScreenDto, UpdateScreenDto } from './dto/screen.dto';

@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  // CADASTRAR TELA:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('new')
  async create(@Body() newScreen: CreateScreenDto[]) {
    return await this.screensService.create(newScreen);
  }

  // BUSCAR TODAS AS TELAS:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.screensService.findAll();
  }
}
