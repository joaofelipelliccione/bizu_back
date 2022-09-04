import { PlatformTypesEnum } from '../enum/platformTypesEnum';
import { MinLength, IsEnum } from 'class-validator';
import { Country } from '../../countries/entities/country.entity';

export class CreateAppDto {
  platform: string;
  name: string;
  logo: string;
  slogan: string;
  websiteLink: string;
  category: string;
  country: number;
}

export class UpdateAppDto {
  @IsEnum(PlatformTypesEnum, {
    message: 'Plataformas aceitas: Android | IOS | Both | Web.',
  })
  platform: string;

  @MinLength(1, {
    message: 'O nome do aplicativo deve possuir, no mínimo, 1 caractere.',
  })
  name: string;

  @MinLength(8, {
    message: 'O link do logotipo deve apresentar, no mínimo, 8 caracteres',
  })
  logo: string;

  @MinLength(3, {
    message: 'O slogan do aplicativo deve possuir, no mínimo, 3 caracteres.',
  })
  slogan: string;

  @MinLength(8, {
    message: 'O link do website deve apresentar, no mínimo, 8 caracteres',
  })
  websiteLink: string;

  @MinLength(3, {
    message: 'O categoria do aplicativo deve possuir, no mínimo, 3 caracteres.',
  })
  category: string;

  country: Country;
}

export class AppDto extends CreateAppDto {
  id: number;
}
