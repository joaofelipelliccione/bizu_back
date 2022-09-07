import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/users/enum/role.enum';
import { AppsService } from './apps.service';
import { Platform } from './enum/platform.enum';
import { CreateAppDto, UpdateAppDto, AppQueryDto } from './dto/app.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  // CADASTRAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('new')
  async create(@Body() newApp: CreateAppDto) {
    return await this.appsService.create(newApp);
  }

  // ATUALIZAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() data: Partial<UpdateAppDto>) {
    return await this.appsService.update(id, data);
  }

  // BUSCAR TODOS OS APPS MOBILE:
  @UseGuards(JwtAuthGuard)
  @Get('mobile')
  async findAllMobileApps() {
    return await this.appsService.findAllByAppPlatform(Platform.MOBILE);
  }

  // BUSCAR TODOS OS APPS WEB:
  @UseGuards(JwtAuthGuard)
  @Get('web')
  async findAllWebApps() {
    return await this.appsService.findAllByAppPlatform(Platform.WEB);
  }

  // BUSCAR APPS MOBILE POR Query Params:
  @UseGuards(JwtAuthGuard)
  @Get('mobile/filter')
  async findAllMobAppsByQuery(@Query() queryParams: AppQueryDto) {
    return await this.appsService.findAllAppsByQuery(
      Platform.MOBILE,
      queryParams,
    );
  }

  // BUSCAR APPS WEB POR Query Params:
  @UseGuards(JwtAuthGuard)
  @Get('web/filter')
  async findAllWebAppsByQuery(@Query() queryParams: AppQueryDto) {
    return await this.appsService.findAllAppsByQuery(Platform.WEB, queryParams);
  }

  // BUSCAR APPS POR id:
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOneByAppId(@Param('id') id: number) {
    return await this.appsService.findOneByAppId(id);
  }

  // DELETAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('remove/:id')
  async destroy(@Param('id') id: number) {
    return await this.appsService.destroy(id);
  }
}
