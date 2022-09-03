export class CreateAppDto {
  appPlatform: string;
  appName: string;
  appLogo: string;
  appSlogan: string;
  appWebsiteLink: string;
  appCategory: string;
  appCountry: number;
}

export class AppDto extends CreateAppDto {
  appId: number;
}
