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
  async create(data: CreateScreenDto[]): Promise<GenericResponseDto> {
    try {
      await Promise.all(
        data.map(async ({ print, flow, app }) => {
          const existentScreen = await this.findOneByScreenPrint(print);
          if (existentScreen !== null) {
            throw new Error('Tela já registrada.');
          }

          const existentFlow = await this.flowRepository.findOneBy({
            id: flow,
          });
          if (existentFlow === null) {
            throw new Error(
              'Antes de cadastrar a tela, deve-se registrar o fluxo da qual ela faz parte.',
            );
          }

          const existentApp = await this.appRepository.findOneBy({ id: app });
          if (existentApp === null) {
            throw new Error(
              'Antes de cadastrar a tela, deve-se registrar o app da qual ela faz parte.',
            );
          }
        }),
      );
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro encontrado pré registro de tela - ${error}`,
      };
    }

    await Promise.all(
      data.map(async ({ print, flow, app }) => {
        const newScreen = new Screen();
        newScreen.print = print;
        newScreen.flow = await this.flowRepository.findOneBy({ id: flow });
        newScreen.app = await this.appRepository.findOneBy({ id: app });

        const validationErrors = await validate(newScreen);
        if (validationErrors.length > 0) {
          return {
            statusCode: 400,
            message: `Erro de validação: ${
              Object.values(validationErrors[0].constraints)[0]
            }`,
          };
        }

        return await this.screenRepository
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
      }),
    );
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
