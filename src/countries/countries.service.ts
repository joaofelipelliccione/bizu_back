import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Country } from './entities/country.entity';
import { CreateCountryDto, UpdateCountryDto } from './dto/country.dto';
import { GenericResponseDto } from '../common/dto/response.dto';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('COUNTRY_REPOSITORY')
    private countryRepository: Repository<Country>,
  ) {}

  // BUSCAR PAÍS POR name. Utilizado dentro do service create():
  async findOneByCountryName(countryName: string): Promise<Country | null> {
    return await this.countryRepository.findOneBy({ name: countryName });
  }

  // CADASTRAR PAÍS:
  async create(data: CreateCountryDto): Promise<GenericResponseDto> {
    try {
      const existentCountry = await this.findOneByCountryName(data.name);
      if (existentCountry !== null) {
        return {
          statusCode: 409,
          message: `País já registrado.`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de país pré registro: ${error}`,
      };
    }

    const newCountry = new Country();
    newCountry.name = data.name;
    newCountry.flag = data.flag;

    const validationErrors = await validate(newCountry);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return this.countryRepository
      .save(newCountry)
      .then(() => {
        return {
          statusCode: 201,
          message: 'País registrado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar país: ${error}`,
        };
      });
  }

  // ATUALIZAR PAÍS:
  async update(
    countryId: number,
    data: Partial<UpdateCountryDto>,
  ): Promise<GenericResponseDto> {
    try {
      const existentCountry = await this.countryRepository.findOneBy({
        id: countryId,
      });

      if (existentCountry === null) {
        return {
          statusCode: 404,
          message: `País não encontrado :(`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de país pré atualização: ${error}`,
      };
    }

    const countryToUpdate = new UpdateCountryDto();
    countryToUpdate.name = data.name;
    countryToUpdate.flag = data.flag;

    const validationErrors = await validate(countryToUpdate, {
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

    return await this.countryRepository
      .update(countryId, countryToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'País atualizado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar país: ${error}`,
        };
      });
  }

  // DELETAR PAÍS:
  async destroy(countryId: number): Promise<GenericResponseDto> {
    try {
      const existentCountry = await this.countryRepository.findOneBy({
        id: countryId,
      });

      if (existentCountry === null) {
        return {
          statusCode: 404,
          message: `País não encontrado :(`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de país pré deleção: ${error}`,
      };
    }

    return this.countryRepository
      .delete({ id: countryId })
      .then(() => {
        return {
          statusCode: 200,
          message: 'País removido com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover País: ${error}`,
        };
      });
  }

  // BUSCAR TODOS OS PAÍSES:
  async findAll(): Promise<Country[] | GenericResponseDto> {
    return this.countryRepository
      .find()
      .then((countries) => countries)
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar países: ${error}`,
        };
      });
  }
}
