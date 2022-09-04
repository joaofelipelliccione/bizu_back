import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { validate } from 'class-validator';
import { CreateCountryDto } from './dto/country.dto';
import { GenericResponseDto } from '../dto/response.dto';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('COUNTRY_REPOSITORY')
    private countryRepository: Repository<Country>,
  ) {}

  // BUSCAR PAÍS POR name. Utilizado dentro do service create():
  async findByCountryName(countryName: string): Promise<Country | null> {
    return this.countryRepository.findOneBy({ name: countryName });
  }

  // CADASTRAR PAÍS:
  async create(data: CreateCountryDto): Promise<GenericResponseDto> {
    const newCountry = new Country();
    newCountry.name = data.name;
    newCountry.flag = data.flag;

    const existentCountry = await this.findByCountryName(data.name);
    if (existentCountry !== null) {
      return {
        statusCode: 409,
        message: `País já registrado.`,
      };
    }

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

  // DELETAR PAÍS:
  async destroy(countryId: number): Promise<GenericResponseDto> {
    const existentCountry = await this.countryRepository.findOneBy({
      id: countryId,
    });

    if (existentCountry === null) {
      return {
        statusCode: 404,
        message: `País não encontrado :(`,
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
  async find(): Promise<Country[]> {
    return this.countryRepository.find();
  }
}
