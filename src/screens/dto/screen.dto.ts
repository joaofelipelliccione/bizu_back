import { MinLength } from 'class-validator';

export class CreateScreenDto {
  print: string;
}

export class ScreenDto extends CreateScreenDto {
  id: string;
}

export class UpdateScreenDto {
  @MinLength(8, {
    message:
      'O link do print da tela deve apresentar, no mínimo, 8 caracteres.',
  })
  print: string;
}
