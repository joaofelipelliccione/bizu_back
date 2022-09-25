import { Platform } from '../enum/platform.enum';
import { MinLength, IsEnum } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { Country } from '../../countries/entities/country.entity';
import { App } from '../entities/app.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateAppDto {
  platform: Platform;
  name: string;
  logo: string;
  slogan: string;
  websiteLink: string;
  category: number;
  country: number;
}

export class UpdateAppDto {
  @IsEnum(Platform, {
    message: 'Plataformas aceitas: Mobile | Web.',
  })
  platform: Platform;

  @MinLength(1, {
    message: 'O nome da aplicação deve possuir, no mínimo, 1 caractere.',
  })
  name: string;

  @MinLength(8, {
    message: 'O link do logotipo deve apresentar, no mínimo, 8 caracteres',
  })
  logo: string;

  @MinLength(3, {
    message: 'O slogan da aplicação deve possuir, no mínimo, 3 caracteres.',
  })
  slogan: string;

  @MinLength(8, {
    message: 'O link do website deve apresentar, no mínimo, 8 caracteres',
  })
  websiteLink: string;

  category: Category;

  country: Country;
}

export class AppDto extends CreateAppDto {
  id: number;
}

export class AppQueryForSearchbarDto {
  platform: string;
}

export class SearchbarAppsResultDto {
  id: number;
  logo: string;
  name: string;
  platform: Platform;
}

export class AppQueryDto extends PaginationDto {
  name: string;
  category: string;
  country: string;
}

export class PaginatedAppsResultDto {
  data: App[];
  page: number;
  appsPerPage: number;
  totalApps: number;
  hasNextPage: boolean;
}
