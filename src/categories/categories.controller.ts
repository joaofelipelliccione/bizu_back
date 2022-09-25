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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // CADASTRAR CATEGORIA:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() newCategory: CreateCategoryDto) {
    return await this.categoriesService.create(newCategory);
  }

  // ATUALIZAR CATEGORIA:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<UpdateCategoryDto>,
  ) {
    return await this.categoriesService.update(id, data);
  }

  // BUSCAR TODAS AS CATEGORIAS:
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return await this.categoriesService.findAll();
  }

  // DELETAR CATEGORIA:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async destroy(@Param('id') id: number) {
    return await this.categoriesService.destroy(id);
  }
}
