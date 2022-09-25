import { MinLength } from 'class-validator';

export class CreateCategoryDto {
  name: string;
}

export class UpdateCategoryDto {
  @MinLength(3, {
    message: 'O nome da categoria deve possuir, no mínimo, 3 caracteres.',
  })
  name: string;
}

export class CountryDto extends CreateCategoryDto {
  id: string;
}
