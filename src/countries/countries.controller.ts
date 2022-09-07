import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { CountriesService } from './countries.service';
import { CreateCountryDto, UpdateCountryDto } from './dto/country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  // CADASTRAR PAÍS:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('new')
  async create(@Body() newCountry: CreateCountryDto) {
    return await this.countriesService.create(newCountry);
  }

  // ATUALIZAR PAÍS:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<UpdateCountryDto>,
  ) {
    return await this.countriesService.update(id, data);
  }

  // BUSCAR TODOS OS PAÍSES:
  @Get()
  async findAll() {
    return await this.countriesService.findAll();
  }

  // DELETAR PAÍS:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('remove/:id')
  async destroy(@Param('id') id: number) {
    return await this.countriesService.destroy(id);
  }
}
