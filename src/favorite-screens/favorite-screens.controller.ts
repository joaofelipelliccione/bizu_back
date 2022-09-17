import {
  Controller,
  UseGuards,
  Post,
  Get,
  Delete,
  Request,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavoriteScreensService } from './favorite-screens.service';
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
  create(@Request() req, @Param('screenId') screenId: number) {
    const token = req.cookies.accessToken;
    return this.favoriteScreensService.create(token, screenId);
  }

  // BUSCAR TODAS AS TELAS MOBILE FAVORITADAS POR DETERMINADO USUÁRIO:
  @UseGuards(JwtAuthGuard)
  @Get('mobile/users/current')
  async findAllMobileFavoriteScreens(
    @Request() req,
    @Query() queryParams: PaginationDto,
  ) {
    const token = req.cookies.accessToken;
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
    @Request() req,
    @Query() queryParams: PaginationDto,
  ) {
    const token = req.cookies.accessToken;
    return await this.favoriteScreensService.findAllByAppPlatform(
      token,
      Platform.WEB,
      queryParams,
    );
  }

  // DELETAR TELA FAVORITADA:
  @UseGuards(JwtAuthGuard)
  @Delete('screen/:screenId')
  async destroy(@Request() req, @Param('screenId') screenId: number) {
    const token = req.cookies.accessToken;
    return await this.favoriteScreensService.destroy(token, screenId);
  }
}
