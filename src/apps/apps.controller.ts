import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/users/enum/role.enum';
import { AppsService } from './apps.service';
import { CreateAppDto, UpdateAppDto, AppQueryDto } from './dto/app.dto';
import { Platform } from './enum/platform.enum';

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

  // BUSCAR TODOS OS APPS MOBILE:
  @UseGuards(JwtAuthGuard)
  @Get('mobile')
  findMobileApps() {
    return this.appsService.findAppsByPlatform(Platform.MOBILE);
  }

  // BUSCAR TODOS OS APPS WEB:
  @UseGuards(JwtAuthGuard)
  @Get('web')
  findWebApps() {
    return this.appsService.findAppsByPlatform(Platform.WEB);
  }

  // BUSCAR APPS MOBILE POR Query Params:
  @UseGuards(JwtAuthGuard)
  @Get('mobile/filter')
  findMobAppsByQuery(@Query() queryParams: AppQueryDto) {
    return this.appsService.findAppsByQuery(Platform.MOBILE, queryParams);
  }

  // BUSCAR APPS WEB POR Query Params:
  @UseGuards(JwtAuthGuard)
  @Get('web/filter')
  findWebAppsByQuery(@Query() queryParams: AppQueryDto) {
    return this.appsService.findAppsByQuery(Platform.WEB, queryParams);
  }

  // BUSCAR APPS POR id:
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  findByAppId(@Param('id') id: number) {
    return this.appsService.findByAppId(id);
  }

  // DELETAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('remove/:id')
  async deleteApp(@Param('id') id: number) {
    return this.appsService.destroy(id);
  }
}
