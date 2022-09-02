export class CreateCountryDto {
  countryName: string;
  countryFlag: string;
}

export class CountryDto extends CreateCountryDto {
  countryId: string;
}
