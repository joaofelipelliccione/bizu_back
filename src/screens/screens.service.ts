import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Screen } from './entities/screen.entity';
import { CreateScreenDto, UpdateScreenDto } from './dto/screen.dto';
import { GenericResponseDto } from '../common/dto/response.dto';

@Injectable()
export class ScreensService {
  constructor(
    @Inject('SCREEN_REPOSITORY')
    private screenRepository: Repository<Screen>,
  ) {}

  // BUSCAR TELA POR print. Utilizado dentro do service create():
  async findOneByScreenPrint(screenPrint: string): Promise<Screen | null> {
    return await this.screenRepository.findOneBy({ print: screenPrint });
  }

  // CADASTRAR TELA:
  async create(data: CreateScreenDto): Promise<GenericResponseDto> {
    try {
      const existentScreen = await this.findOneByScreenPrint(data.print);

      if (existentScreen !== null) {
        return {
          statusCode: 409,
          message: `Tela já registrada.`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de tela pré registro: ${error}`,
      };
    }

    const newScreen = new Screen();
    newScreen.print = data.print;

    const validationErrors = await validate(newScreen);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return this.screenRepository
      .save(newScreen)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Tela registrada com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar tela: ${error}`,
        };
      });
  }
}
