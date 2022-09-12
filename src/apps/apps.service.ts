import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository, Like, In } from 'typeorm';
import { App } from './entities/app.entity';
import { Country } from '../countries/entities/country.entity';
import { validate } from 'class-validator';
import { Platform } from './enum/platform.enum';
import { CreateAppDto, UpdateAppDto, AppQueryDto } from './dto/app.dto';
import { GenericResponseDto } from '../common/dto/response.dto';

@Injectable()
export class AppsService {
  constructor(
    @Inject('APP_REPOSITORY')
    private appRepository: Repository<App>,
    @Inject('COUNTRY_REPOSITORY')
    private countryRepository: Repository<Country>,
  ) {}

  // BUSCAR APP POR name. Utilizado dentro do service create():
  async findOneByAppName(appName: string): Promise<App | null> {
    return await this.appRepository.findOneBy({ name: appName });
  }

  // CADASTRAR APP:
  async create(data: CreateAppDto): Promise<GenericResponseDto> {
    const existentApp = await this.findOneByAppName(data.name);
    if (existentApp !== null) {
      throw new ConflictException('Aplicação já registrada.');
    }

    const existentCountry = await this.countryRepository.findOneBy({
      id: data.country,
    });
    if (existentCountry === null) {
      throw new NotFoundException(
        'Antes de cadastrar o app, deve-se registrar seu respectivo país de origem.',
      );
    }

    const newApp = new App();
    newApp.platform = data.platform;
    newApp.name = data.name;
    newApp.logo = data.logo;
    newApp.slogan = data.slogan;
    newApp.websiteLink = data.websiteLink;
    newApp.category = data.category;
    newApp.country = existentCountry;

    const validationErrors = await validate(newApp);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return this.appRepository
      .save(newApp)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Aplicação registrada com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar aplicação - ${error}`,
        };
      });
  }

  // ATUALIZAR APP:
  async update(
    appId: number,
    data: Partial<UpdateAppDto>,
  ): Promise<GenericResponseDto> {
    const existentApp = await this.appRepository.findOneBy({
      id: appId,
    });

    if (existentApp === null) {
      throw new NotFoundException('Aplicação não encontrada :(');
    }

    const appToUpdate = new UpdateAppDto();
    appToUpdate.platform = data.platform;
    appToUpdate.name = data.name;
    appToUpdate.logo = data.logo;
    appToUpdate.slogan = data.slogan;
    appToUpdate.websiteLink = data.websiteLink;
    appToUpdate.category = data.category;
    appToUpdate.country = data.country;

    const validationErrors = await validate(appToUpdate, {
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

    return await this.appRepository
      .update(appId, appToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Aplicação atualizada com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar aplicação - ${error}`,
        };
      });
  }

  // BUSCAR APP POR id:
  async findOneByAppId(appId: number): Promise<App> {
    const existentApp = await this.appRepository.findOneBy({
      id: appId,
    });

    if (existentApp === null) {
      throw new NotFoundException('Aplicação não encontrada :(');
    }

    return existentApp;
  }

  // BUSCAR TODOS OS APPS POR PLATAFORMA:
  async findAllByAppPlatform(
    appPlatform: Platform,
  ): Promise<App[] | GenericResponseDto> {
    return this.appRepository
      .findBy({
        platform: appPlatform,
      })
      .then((apps) => apps)
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar aplicações - ${error}`,
        };
      });
  }

  // BUSCAR APPS POR name (PESQUISA LIKE %appName%):
  async findAllByLikeSearch(
    appPlatform: Platform,
    queryObj: AppQueryDto,
  ): Promise<App[] | GenericResponseDto> {
    return this.appRepository
      .findBy({
        platform: appPlatform,
        name: Like(`%${queryObj.name}%`),
      })
      .then((apps) => apps)
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar aplicações através de pesquisa por nome - ${error}`,
        };
      });
  }

  // BUSCAR APPS POR FILTROS:
  async findAllAppsByQuery(
    appPlatform: Platform,
    queryObj: Partial<AppQueryDto>,
  ): Promise<App[] | GenericResponseDto> {
    if (queryObj.category && queryObj.country) {
      const categoriesArray = queryObj.category.split('_');
      const countriesArray = queryObj.country
        .split('_')
        .map((element) => Number(element));

      return this.appRepository
        .findBy({
          platform: appPlatform,
          category: In(categoriesArray),
          country: { id: In(countriesArray) },
        })
        .then((apps) => apps)
        .catch((error) => {
          return {
            statusCode: 500,
            message: `Erro ao buscar aplicação utilizando filtro de categoria e país - ${error}`,
          };
        });
    }

    if (queryObj.category) {
      const categoriesArray = queryObj.category.split('_');

      return this.appRepository
        .findBy({
          platform: appPlatform,
          category: In(categoriesArray),
        })
        .then((apps) => apps)
        .catch((error) => {
          return {
            statusCode: 500,
            message: `Erro ao buscar aplicação utilizando filtro de categoria - ${error}`,
          };
        });
    }

    if (queryObj.country) {
      const countriesArray = queryObj.country
        .split('_')
        .map((element) => Number(element));

      return this.appRepository
        .findBy({
          platform: appPlatform,
          country: { id: In(countriesArray) },
        })
        .then((apps) => apps)
        .catch((error) => {
          return {
            statusCode: 500,
            message: `Erro ao buscar aplicação utilizando filtro de país - ${error}`,
          };
        });
    }
  }

  // DELETAR APP:
  async destroy(appId: number): Promise<GenericResponseDto> {
    const existentApp = await this.appRepository.findOneBy({
      id: appId,
    });

    if (existentApp === null) {
      throw new NotFoundException('Aplicação não encontrada :(');
    }

    return this.appRepository
      .delete({ id: appId })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Aplicação removida com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover aplicação - ${error}`,
        };
      });
  }
}
