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

  // CRIAR TELA(S) NA MEMÓRIA. Utilizado dentro de create():
  async checkFlowAndCreateInMemory(
    app: App,
    flowId: number,
    prints: string[],
  ): Promise<Screen[]> {
    const existentFlow = await this.flowRepository.findOneBy({ id: flowId });
    if (existentFlow === null) {
      throw new NotFoundException(
        'Antes de realizar o registro de telas, deve-se cadastrar o fluxo da qual elas pertencem.',
      );
    }

    const createdScreensArray = await Promise.all(
      prints.map(async (print) => {
        const existentScreen = await this.screenRepository.findOneBy({
          print,
        });
        if (existentScreen) {
          throw new BadRequestException(
            'A tela já foi cadastrada anteriormente.',
          );
        }

        return this.screenRepository.create({ app, flow: existentFlow, print });
      }),
    );

    return createdScreensArray;
  }

  // CRIAR TELA(S) NO BANCO:
  async create(appId: number, data: CreateScreenDto[]): Promise<any> {
    const existentApp = await this.appRepository.findOneBy({ id: appId });
    if (existentApp === null) {
      throw new NotFoundException(
        'Antes de realizar o registro de telas, deve-se cadastrar a aplicação da qual elas pertencem.',
      );
    }

    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const createdScreensArray = await Promise.all(
          data.map(async ({ flowId, prints }) =>
            this.checkFlowAndCreateInMemory(existentApp, flowId, prints),
          ),
        );

        return Promise.all(
          createdScreensArray.map((screens) =>
            transactionalEntityManager.save(screens),
          ),
        )
          .then(() => {
            return {
              statusCode: 201,
              message: 'Tela(s) criadas com sucesso!',
            };
          })
          .catch((error) => {
            return {
              statusCode: 500,
              message: `Erro ao criar tela(s) - ${error}`,
            };
          });
      },
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
          message: `Erro ao buscar telas - ${error}`,
        };
      });
  }
}
