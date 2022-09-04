import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { App } from './entities/app.entity';
import { Country } from '../countries/entities/country.entity';
import { validate } from 'class-validator';
import { CreateAppDto } from './dto/app.dto';
import { GenericResponseDto } from '../dto/response.dto';

@Injectable()
export class AppsService {
  constructor(
    @Inject('APP_REPOSITORY')
    private appRepository: Repository<App>,
    @Inject('COUNTRY_REPOSITORY')
    private countryRepository: Repository<Country>,
  ) {}

  // BUSCAR APP POR appName. Utilizado dentro do service create():
  async findByAppName(appName: string): Promise<App | null> {
    return this.appRepository.findOneBy({ appName: appName });
  }

  // CADASTRAR APP:
  async create(data: CreateAppDto): Promise<GenericResponseDto> {
    const existentCountry = await this.countryRepository.findOneBy({
      countryId: data.appCountry,
    });
    if (existentCountry === null) {
      return {
        statusCode: 400,
        message: `Antes de cadastrar o app, deve-se registrar seu respectivo país de origem.`,
      };
    }

    const newApp = new App();
    newApp.appPlatform = data.appPlatform;
    newApp.appName = data.appName;
    newApp.appLogo = data.appLogo;
    newApp.appSlogan = data.appSlogan;
    newApp.appWebsiteLink = data.appWebsiteLink;
    newApp.appCategory = data.appCategory;
    newApp.appCountry = existentCountry;

    const existentApp = await this.findByAppName(data.appName);
    if (existentApp !== null) {
      return {
        statusCode: 409,
        message: `Aplicativo já registrado.`,
      };
    }

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

  // DELETAR APP:
  // async destroy(countryId: number): Promise<GenericResponseDto> {
  //   const existentCountry = await this.appRepository.findOneBy({
  //     countryId,
  //   });

  //   if (existentCountry === null) {
  //     return {
  //       statusCode: 404,
  //       message: `País não encontrado :(`,
  //     };
  //   }

  //   return this.appRepository
  //     .delete({ countryId })
  //     .then(() => {
  //       return {
  //         statusCode: 200,
  //         message: 'País removido com sucesso.',
  //       };
  //     })
  //     .catch((error) => {
  //       return {
  //         statusCode: 500,
  //         message: `Erro ao remover País: ${error}`,
  //       };
  //     });
  // }

  // BUSCAR TODOS OS APPS:
  async find(): Promise<App[]> {
    return this.appRepository.find();
  }
}
