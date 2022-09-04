export class CreateAppDto {
  platform: string;
  name: string;
  logo: string;
  slogan: string;
  websiteLink: string;
  category: string;
  country: number;
}

export class AppDto extends CreateAppDto {
  id: number;
}
