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
        'Antes de realizar o registro de tela(s), deve-se cadastrar o fluxo da qual elas pertencem.',
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
        'Antes de realizar o registro de tela(s), deve-se cadastrar a aplicação da qual ela(s) pertencem.',
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
            this.appRepository.update(appId, {
              lastUpdate: () => 'NOW()',
            });

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

  // ATUALIZAR TELA:
  async update(
    screenId: number,
    data: Partial<UpdateScreenDto>,
  ): Promise<GenericResponseDto> {
    const existentScreen = await this.screenRepository.findOneBy({
      id: screenId,
    });
    if (existentScreen === null) {
      throw new NotFoundException('Tela não encontrada :(');
    }

    const screenToUpdate = new UpdateScreenDto();
    screenToUpdate.app = data.app;
    screenToUpdate.flow = data.flow;
    screenToUpdate.print = data.print;

    const validationErrors = await validate(screenToUpdate, {
      skipMissingProperties: true,
    });
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return await this.screenRepository
      .update(screenId, screenToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Tela atualizada com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar tela - ${error}`,
        };
      });
  }

  // BUSCAR TELA POR id:
  async findOneById(screenId: number): Promise<Screen> {
    const existentScreen = await this.screenRepository.findOneBy({
      id: screenId,
    });
    if (existentScreen === null) {
      throw new NotFoundException('Tela não encontrada :(');
    }

    return existentScreen;
  }

  // BUSCAR TODAS AS TELAS:
  async findAll(): Promise<Screen[] | GenericResponseDto> {
    return this.screenRepository
      .find()
      .then((screens) => screens)
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar tela(s) - ${error}`,
        };
      });
  }

  // DELETAR TODAS AS TELAS DE UM APP:
  async destroy(appId: number): Promise<GenericResponseDto> {
    const existentApp = await this.appRepository.findOneBy({
      id: appId,
    });

    if (existentApp === null) {
      throw new NotFoundException('Aplicação não encontrada :(');
    }

    return this.screenRepository
      .delete({ app: existentApp })
      .then((res) => {
        if (res.affected === 0) {
          return {
            statusCode: 400,
            message: 'A aplicação não apresenta tela(s) cadastrada(s).',
          };
        }

        return {
          statusCode: 200,
          message: 'Tela(s) da aplicação removida(s) com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover tela(s) da aplicação - ${error}`,
        };
      });
  }
}
