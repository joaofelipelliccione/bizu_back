import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  // CADASTRAR PAÍS:
  @Post('new')
  create(@Body() newCountry: CreateCountryDto) {
    return this.countriesService.create(newCountry);
  }

  // BUSCAR TODOS OS PAÍSES:
  @Get()
  findAll() {
    return this.countriesService.find();
  }

  // DELETAR PAÍS:
  @Delete('remove/:id')
  async deleteCountry(@Param('id') id: number) {
    return this.countriesService.destroy(id);
  }
}
