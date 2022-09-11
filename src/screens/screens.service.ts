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
  async create(appId: number, data: CreateScreenDto[]): Promise<any> {
    try {
      const existentApp = await this.appRepository.findOneBy({ id: appId });
      const existentFlows = await Promise.all(
        data.map(
          async ({ flow }) => await this.flowRepository.findOneBy({ id: flow }),
        ),
      );

      if (existentApp === null || existentFlows.includes(null)) {
        return {
          statusCode: 400,
          message: `Antes de registrar telas, deve-se cadastrar a aplicação e o fluxo da qual elas pertencem.`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de aplicativo/fluxo pré registro de telas: ${error}`,
      };
    }
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
