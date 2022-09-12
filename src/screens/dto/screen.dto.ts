import { MinLength } from 'class-validator';

export class CreateScreenDto {
  flowId: number;
  prints: string[];
}

export class UpdateScreenDto {
  @MinLength(8, {
    message:
      'O link do print da tela deve apresentar, no mínimo, 8 caracteres.',
  })
  print: string;

  flowId: number;

  appId: number;
}

export class ScreenDto {
  id: string;
  print: string;
  flow: number;
  app: number;
}
