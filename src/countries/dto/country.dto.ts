import { MinLength } from 'class-validator';

export class CreateCountryDto {
  name: string;
  flag: string;
}

export class CountryDto extends CreateCountryDto {
  id: string;
}

export class UpdateCountryDto {
  @MinLength(3, {
    message: 'O nome do país deve possuir, no mínimo, 3 caracteres.',
  })
  name: string;

  @MinLength(8, {
    message:
      'O link da imagem da bandeira do país deve apresentar, no mínimo, 8 caracteres.',
  })
  flag: string;
}
