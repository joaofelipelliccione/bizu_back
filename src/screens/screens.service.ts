import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Screen } from './entities/screen.entity';
import { CreateScreenDto, UpdateScreenDto } from './dto/screen.dto';
import { GenericResponseDto } from '../common/dto/response.dto';
import { Flow } from '../flows/entities/flow.entity';
import { App } from '../apps/entities/app.entity';

@Injectable()
export class ScreensService {
  constructor(
    @Inject('SCREEN_REPOSITORY')
    private screenRepository: Repository<Screen>,
    @Inject('FLOW_REPOSITORY')
    private flowRepository: Repository<Flow>,
    @Inject('APP_REPOSITORY')
    private appRepository: Repository<App>,
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

    const existentFlow = await this.flowRepository.findOneBy({
      id: data.flow,
    });
    if (existentFlow === null) {
      return {
        statusCode: 400,
        message: `Antes de cadastrar a tela, deve-se registrar o fluxo da qual ela faz parte.`,
      };
    }

    const existentApp = await this.appRepository.findOneBy({
      id: data.app,
    });
    if (existentApp === null) {
      return {
        statusCode: 400,
        message: `Antes de cadastrar a tela, deve-se registrar o app da qual ela faz parte.`,
      };
    }

    const newScreen = new Screen();
    newScreen.print = data.print;
    newScreen.flow = existentFlow;
    newScreen.app = existentApp;

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

  // BUSCAR TODAS AS TELAS:
  async findAll(): Promise<Screen[] | GenericResponseDto> {
    return this.screenRepository
      .find()
      .then((screens) => screens)
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar telas: ${error}`,
        };
      });
  }
}
