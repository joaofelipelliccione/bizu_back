import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FavoriteScreen } from './entities/favorite-screen.entity';
import { CreateFavoriteScreenDto } from './dto/favorite-screen.dto';
import { GenericResponseDto } from '../common/dto/response.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Screen } from '../screens/entities/screen.entity';

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
}
