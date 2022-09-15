import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavoriteScreensService } from './favorite-screens.service';
import { CreateFavoriteScreenDto } from './dto/favorite-screen.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Platform } from '../apps/enum/platform.enum';

@Controller('favoriteScreens')
export class FavoriteScreensController {
  constructor(
    private readonly favoriteScreensService: FavoriteScreensService,
  ) {}

  // CADASTRAR NOVA TELA FAVORITADA:
  @UseGuards(JwtAuthGuard)
  @Post('screen/:screenId')
  create(
    @Headers('Authorization') authorization: string,
    @Param('screenId') screenId: number,
  ) {
    const token = authorization.replace('Bearer ', '');
    return this.favoriteScreensService.create(token, screenId);
  }

  // BUSCAR TODAS AS TELAS MOBILE FAVORITADAS POR DETERMINADO USUÁRIO:
  @UseGuards(JwtAuthGuard)
  @Get('mobile/users/current')
  async findAllMobileFavoriteScreens(
    @Headers('Authorization') authorization: string,
    @Query() queryParams: PaginationDto,
  ) {
    const token = authorization.replace('Bearer ', '');
    return await this.favoriteScreensService.findAllByAppPlatform(
      token,
      Platform.MOBILE,
      queryParams,
    );
  }

  // BUSCAR TODAS AS TELAS WEB FAVORITADAS POR DETERMINADO USUÁRIO:
  @UseGuards(JwtAuthGuard)
  @Get('web/users/current')
  async findAllWebFavoriteScreens(
    @Headers('Authorization') authorization: string,
    @Query() queryParams: PaginationDto,
  ) {
    const token = authorization.replace('Bearer ', '');
    return await this.favoriteScreensService.findAllByAppPlatform(
      token,
      Platform.WEB,
      queryParams,
    );
  }

  // DELETAR TELA FAVORITADA:
  @UseGuards(JwtAuthGuard)
  @Delete('screen/:screenId')
  async destroy(
    @Headers('Authorization') authorization: string,
    @Param('screenId') screenId: number,
  ) {
    const token = authorization.replace('Bearer ', '');
    return await this.favoriteScreensService.destroy(token, screenId);
  }
}
