import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { GenericResponseDto } from '../common/dto/response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  // BUSCAR CATEGORIA POR name. Utilizado dentro do service create():
  async findOneByCategoryName(categoryName: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ name: categoryName });
  }

  // CADASTRAR CATEGORIA:
  async create(data: CreateCategoryDto): Promise<GenericResponseDto> {
    const existentCategory = await this.findOneByCategoryName(data.name);
    if (existentCategory !== null) {
      throw new ConflictException('Categoria já registrada.');
    }

    const newCategory = new Category();
    newCategory.name = data.name;

    const validationErrors = await validate(newCategory);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return this.categoryRepository
      .save(newCategory)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Categoria registrada com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar categoria - ${error}`,
        };
      });
  }

  // ATUALIZAR CATEGORIA:
  async update(
    categoryId: number,
    data: Partial<UpdateCategoryDto>,
  ): Promise<GenericResponseDto> {
    const existentCategory = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (existentCategory === null) {
      throw new NotFoundException('Categoria não encontrada :(');
    }

    const categoryToUpdate = new UpdateCategoryDto();
    categoryToUpdate.name = data.name;

    const validationErrors = await validate(categoryToUpdate, {
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

    return await this.categoryRepository
      .update(categoryId, categoryToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Categoria atualizada com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar categoria - ${error}`,
        };
      });
  }

  // BUSCAR TODAS AS CATEGORIAS:
  async findAll(): Promise<Category[] | GenericResponseDto> {
    return this.categoryRepository
      .find()
      .then((categories) => categories)
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar categorias - ${error}`,
        };
      });
  }

  // DELETAR CATEGORIA:
  async destroy(categoryId: number): Promise<GenericResponseDto> {
    const existentCategory = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (existentCategory === null) {
      throw new NotFoundException('Categoria não encontrada :(');
    }

    return this.categoryRepository
      .delete({ id: categoryId })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Categoria removida com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover categoria - ${error}`,
        };
      });
  }
}
