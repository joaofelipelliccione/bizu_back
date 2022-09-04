import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/users/enum/role.enum';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  // CADASTRAR PAÍS:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('remove/:id')
  async deleteCountry(@Param('id') id: number) {
    return this.countriesService.destroy(id);
  }
}
