export class CreateCountryDto {
  name: string;
  flag: string;
}

export class CountryDto extends CreateCountryDto {
  id: string;
}
