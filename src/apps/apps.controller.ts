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
import {
  CreateAppDto,
  UpdateAppDto,
  AppQueryForSearchbarDto,
  AppQueryDto,
} from './dto/app.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  // CADASTRAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() newApp: CreateAppDto) {
    return await this.appsService.create(newApp);
  }

  // ATUALIZAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: Partial<UpdateAppDto>) {
    return await this.appsService.update(id, data);
  }

  // BUSCAR IDs, NOMES, LOGOs DE APPS P/ SEARCHBAR
  @Get('searchbar')
  async findAllForSearchbar(@Query() queryParams: AppQueryForSearchbarDto) {
    return await this.appsService.findAllForSearchbar(queryParams);
  }

  // BUSCAR TODOS OS APPS MOBILE:
  @UseGuards(JwtAuthGuard)
  @Get('mobile')
  async findAllMobileApps(@Query() queryParams: PaginationDto) {
    return await this.appsService.findAllByAppPlatform(
      Platform.MOBILE,
      queryParams,
    );
  }

  // BUSCAR TODOS OS APPS WEB:
  @UseGuards(JwtAuthGuard)
  @Get('web')
  async findAllWebApps(@Query() queryParams: PaginationDto) {
    return await this.appsService.findAllByAppPlatform(
      Platform.WEB,
      queryParams,
    );
  }

  // BUSCAR APPS MOBILE POR PESQUISA LIKE %appName%:
  @UseGuards(JwtAuthGuard)
  @Get('mobile/search')
  async findAllMobAppsByLikeSearch(@Query() queryParams: AppQueryDto) {
    return await this.appsService.findAllByLikeSearch(
      Platform.MOBILE,
      queryParams,
    );
  }

  // BUSCAR APPS WEB POR PESQUISA LIKE %appName%:
  @UseGuards(JwtAuthGuard)
  @Get('web/search')
  async findAllWeAppsByLikeSearch(@Query() queryParams: AppQueryDto) {
    return await this.appsService.findAllByLikeSearch(
      Platform.WEB,
      queryParams,
    );
  }

  // BUSCAR APPS MOBILE POR FILTROS:
  @UseGuards(JwtAuthGuard)
  @Get('mobile/filter')
  async findAllMobAppsByQuery(@Query() queryParams: AppQueryDto) {
    return await this.appsService.findAllAppsByQuery(
      Platform.MOBILE,
      queryParams,
    );
  }

  // BUSCAR APPS WEB POR FILTROS:
  @UseGuards(JwtAuthGuard)
  @Get('web/filter')
  async findAllWebAppsByQuery(@Query() queryParams: AppQueryDto) {
    return await this.appsService.findAllAppsByQuery(Platform.WEB, queryParams);
  }

  // BUSCAR APPS POR id:
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneByAppId(@Param('id') id: number) {
    return await this.appsService.findOneByAppId(id);
  }

  // DELETAR APP:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async destroy(@Param('id') id: number) {
    return await this.appsService.destroy(id);
  }
}
