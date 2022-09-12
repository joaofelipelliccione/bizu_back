import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Screen } from './entities/screen.entity';
import { CreateScreenDto, UpdateScreenDto } from './dto/screen.dto';
import { GenericResponseDto } from '../common/dto/response.dto';
import { Flow } from '../flows/entities/flow.entity';
import { App } from '../apps/entities/app.entity';

@Injectable()
export class ScreensService {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    @Inject('SCREEN_REPOSITORY')
    private screenRepository: Repository<Screen>,
    @Inject('FLOW_REPOSITORY')
    private flowRepository: Repository<Flow>,
    @Inject('APP_REPOSITORY')
    private appRepository: Repository<App>,
  ) {}

  // COMPLETAR:
  async createScreen(app: App, flow: Flow, print: string): Promise<Screen> {
    const existentScreen = await this.screenRepository.findOneBy({
      print,
    });

    if (existentScreen) {
      throw new BadRequestException('A tela já foi cadastrada anteriormente.');
    }

    return this.screenRepository.create({ app, flow, print });
  }

  // COMPLETAR:
  async createScreens(
    app: App,
    flowId: number,
    screens: string[],
  ): Promise<Screen[]> {
    const existentFlow = await this.flowRepository.findOneBy({ id: flowId });
    if (existentFlow === null) {
      throw new NotFoundException(
        'Antes de registrar telas, deve-se cadastrar o fluxo da qual elas pertencem.',
      );
    }

    return Promise.all(
      screens.map(async (screen) =>
        this.createScreen(app, existentFlow, screen),
      ),
    );
  }

  // CADASTRAR TELAS:
  async create(appId: number, data: CreateScreenDto[]): Promise<any> {
    const existentApp = await this.appRepository.findOneBy({ id: appId });
    if (existentApp === null) {
      throw new NotFoundException(
        'Antes de registrar telas, deve-se cadastrar a aplicação da qual elas pertencem.',
      );
    }

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const createdScreens = await Promise.all(
        data.map(async ({ flow, prints }) =>
          this.createScreens(existentApp, flow, prints),
        ),
      );

      return Promise.all(
        createdScreens.map((screens) =>
          transactionalEntityManager.save(screens),
        ),
      );
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
