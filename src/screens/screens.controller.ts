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

  // CADASTRAR TELAS:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('apps/:appId')
  async create(@Param('appId') appId: number, @Body() data: CreateScreenDto[]) {
    return this.screensService.create(appId, data);
  }

  // BUSCAR TODAS AS TELAS:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.screensService.findAll();
  }

  // BUSCAR TELA POR id:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.screensService.findOneById(id);
  }

  // DELETAR TODAS AS TELAS DE UM APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('apps/:appId')
  async destroy(@Param('appId') appId: number) {
    return await this.screensService.destroy(appId);
  }
}
