import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { App } from './entities/app.entity';
import { Country } from '../countries/entities/country.entity';
import { validate } from 'class-validator';
import { CreateAppDto } from './dto/app.dto';
import { UpdateAppDto } from './dto/app.dto';
import { GenericResponseDto } from '../dto/response.dto';

@Injectable()
export class AppsService {
  constructor(
    @Inject('APP_REPOSITORY')
    private appRepository: Repository<App>,
    @Inject('COUNTRY_REPOSITORY')
    private countryRepository: Repository<Country>,
  ) {}

  // BUSCAR APP POR name. Utilizado dentro do service create():
  async findByAppName(appName: string): Promise<App | null> {
    return this.appRepository.findOneBy({ name: appName });
  }

  // CADASTRAR APP:
  async create(data: CreateAppDto): Promise<GenericResponseDto> {
    const existentApp = await this.findByAppName(data.name);
    if (existentApp !== null) {
      return {
        statusCode: 409,
        message: `Aplicativo já registrado.`,
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
    const existentApp = await this.appRepository.findOneBy({
      id: appId,
    });
    if (existentApp === null) {
      return {
        statusCode: 404,
        message: `Aplicativo não encontrado :(`,
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

  // DELETAR APP:
  async destroy(appId: number): Promise<GenericResponseDto> {
    const existentApp = await this.appRepository.findOneBy({
      id: appId,
    });

    if (existentApp === null) {
      return {
        statusCode: 404,
        message: `Aplicativo não encontrado :(`,
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

  // BUSCAR TODOS OS APPS:
  async find(): Promise<App[]> {
    return this.appRepository.find();
  }
}
