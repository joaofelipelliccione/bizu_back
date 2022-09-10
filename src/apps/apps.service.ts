import { Injectable, Inject } from '@nestjs/common';
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
    try {
      const existentApp = await this.findOneByAppName(data.name);
      if (existentApp !== null) {
        return {
          statusCode: 409,
          message: `Aplicativo já registrado.`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de aplicativo pré registro: ${error}`,
      };
    }

    const existentCountry = await this.countryRepository.findOneBy({
      id: data.country,
    });
    if (existentCountry === null) {
      return {
        statusCode: 400,
        message: `Antes de cadastrar o app, deve-se registrar seu respectivo país de origem.`,
      };
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
          message: 'Aplicativo registrado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar aplicativo: ${error}`,
        };
      });
  }

  // ATUALIZAR APP:
  async update(
    appId: number,
    data: Partial<UpdateAppDto>,
  ): Promise<GenericResponseDto> {
    try {
      const existentApp = await this.appRepository.findOneBy({
        id: appId,
      });

      if (existentApp === null) {
        return {
          statusCode: 404,
          message: `Aplicativo não encontrado :(`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de aplicativo pré atualização: ${error}`,
      };
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
          message: 'Aplicativo atualizado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar aplicativo: ${error}`,
        };
      });
  }

  // BUSCAR APP POR id:
  async findOneByAppId(appId: number): Promise<App | GenericResponseDto> {
    return this.appRepository
      .findOneBy({
        id: appId,
      })
      .then((existentApp) => {
        if (existentApp === null) {
          return {
            statusCode: 404,
            message: `Aplicativo não encontrado :(`,
          };
        }

        return existentApp;
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar aplicativo: ${error}`,
        };
      });
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
          message: `Erro ao buscar aplicativos: ${error}`,
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
          message: `Erro ao buscar aplicativos através de pesquisa por nome: ${error}`,
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

      return await this.appRepository
        .createQueryBuilder()
        .where('app.category IN (:...categories)', {
          categories: categoriesArray,
        })
        .andWhere('app.countryId IN (:...countries)', {
          countries: countriesArray,
        })
        .andWhere('app.platform = :platform', { platform: appPlatform })
        .getMany();
    }

    if (queryObj.category) {
      const categoriesArray = queryObj.category.split('_');

      return this.appRepository
        .findBy({
          category: In(categoriesArray),
          platform: appPlatform,
        })
        .then((apps) => apps)
        .catch((error) => {
          return {
            statusCode: 500,
            message: `Erro ao buscar aplicação utilizando filtro de categoria: ${error}`,
          };
        });
    }

    if (queryObj.country) {
      const countriesArray = queryObj.country
        .split('_')
        .map((element) => Number(element));

      return this.appRepository
        .findBy({
          country: { id: In(countriesArray) },
          platform: appPlatform,
        })
        .then((apps) => apps)
        .catch((error) => {
          return {
            statusCode: 500,
            message: `Erro ao buscar aplicação utilizando filtro de país: ${error}`,
          };
        });
    }
  }

  // DELETAR APP:
  async destroy(appId: number): Promise<GenericResponseDto> {
    try {
      const existentApp = await this.appRepository.findOneBy({
        id: appId,
      });

      if (existentApp === null) {
        return {
          statusCode: 404,
          message: `Aplicativo não encontrado :(`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de aplicativo pré deleção: ${error}`,
      };
    }

    return this.appRepository
      .delete({ id: appId })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Aplicativo removido com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover aplicativo: ${error}`,
        };
      });
  }
}
