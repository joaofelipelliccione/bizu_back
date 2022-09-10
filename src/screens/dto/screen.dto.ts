import { MinLength } from 'class-validator';
import { Flow } from '../../flows/entities/flow.entity';

export class CreateScreenDto {
  print: string;
  flow: number;
}

export class UpdateScreenDto {
  @MinLength(8, {
    message:
      'O link do print da tela deve apresentar, no mínimo, 8 caracteres.',
  })
  print: string;

  flow: Flow;
}

export class ScreenDto extends CreateScreenDto {
  id: string;
}
