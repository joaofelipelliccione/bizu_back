import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/users/enum/role.enum';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/app.dto';
import { UpdateAppDto } from './dto/app.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  // CADASTRAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('new')
  create(@Body() newApp: CreateAppDto) {
    return this.appsService.create(newApp);
  }

  // ATUALIZAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() data: Partial<UpdateAppDto>) {
    return this.appsService.update(id, data);
  }

  // BUSCAR TODOS OS APPS:
  @Get()
  findAll() {
    return this.appsService.find();
  }

  // DELETAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('remove/:id')
  async deleteApp(@Param('id') id: number) {
    return this.appsService.destroy(id);
  }
}
