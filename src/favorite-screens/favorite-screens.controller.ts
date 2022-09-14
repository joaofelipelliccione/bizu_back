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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavoriteScreensService } from './favorite-screens.service';
import { CreateFavoriteScreenDto } from './dto/favorite-screen.dto';

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
