import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FavoriteScreen } from './entities/favorite-screen.entity';
import { GenericResponseDto } from '../common/dto/response.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Screen } from '../screens/entities/screen.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Platform } from '../apps/enum/platform.enum';

@Injectable()
export class FavoriteScreensService {
  constructor(
    @Inject('FAVORITE_SCREEN_REPOSITORY')
    private favoriteScreenRepository: Repository<FavoriteScreen>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject('SCREEN_REPOSITORY')
    private screenRepository: Repository<Screen>,
  ) {}

  // CADASTRAR NOVA TELA FAVORITADA:
  async create(token: string, screenId: number): Promise<GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);

    const existentUser = await this.userRepository.findOneBy({
      id: sub,
    });

    if (existentUser === null) {
      throw new NotFoundException(
        'Impossível favoritar tela pois usuário não foi encontrado.',
      );
    }

    const existentScreen = await this.screenRepository.findOneBy({
      id: screenId,
    });

    if (existentScreen === null) {
      throw new NotFoundException(
        'Impossível favoritar tela pois ela não foi encontrada.',
      );
    }

    const newFavoriteScreen = new FavoriteScreen();
    newFavoriteScreen.user = sub;
    newFavoriteScreen.screen = existentScreen;

    return this.favoriteScreenRepository
      .save(newFavoriteScreen)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Nova tela favoritada com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao favoritar tela - ${error}`,
        };
      });
  }

  // BUSCAR TODAS AS TELAS FAVORITADAS POR UM USUÁRIO, POR PLATAFORMA:
  async findAllByAppPlatform(
    token: string,
    appPlatform: Platform,
    queryObj: PaginationDto,
  ): Promise<any | GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);

    const existentUser = await this.userRepository.findOneBy({
      id: sub,
    });

    if (existentUser === null) {
      throw new NotFoundException(
        'Impossível buscar telas favoritas pois usuário não foi encontrado.',
      );
    }

    const PER_PAGE = 3;
    const page = Number(queryObj.page) || 1;
    const favoriteScreensToSkip = (page - 1) * PER_PAGE;
    const totalUserFavoriteScreens = await this.favoriteScreenRepository.count({
      where: { user: { id: sub }, screen: { app: { platform: appPlatform } } },
    });
    const hasNextPage = PER_PAGE * page < totalUserFavoriteScreens;

    return this.favoriteScreenRepository
      .find({
        where: {
          user: { id: sub },
          screen: { app: { platform: appPlatform } },
        },
        order: { createdAt: 'DESC' },
        take: PER_PAGE,
        skip: favoriteScreensToSkip,
      })
      .then((favoriteScreens) => {
        return {
          data: favoriteScreens,
          page,
          favoriteScreensPerPage: favoriteScreens.length,
          totalUserFavoriteScreens,
          hasNextPage,
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar aplicações - ${error}`,
        };
      });
  }

  // DESFAVORITAR TELA:
  async destroy(token: string, screenId: number): Promise<GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);

    const existentUser = await this.userRepository.findOneBy({
      id: sub,
    });

    if (existentUser === null) {
      throw new NotFoundException('Usuário não encontrado :(');
    }

    const favoriteScreen = await this.favoriteScreenRepository.findOne({
      where: { user: { id: sub }, screen: { id: screenId } },
    });

    if (favoriteScreen === null) {
      throw new NotFoundException('O Usuário não favoritou a respectiva tela.');
    }

    return this.favoriteScreenRepository
      .delete(favoriteScreen.id)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Tela desfavoritada com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao desfavoritar tela - ${error}`,
        };
      });
  }
}
