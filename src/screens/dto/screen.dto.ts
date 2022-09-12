import { MinLength } from 'class-validator';
import { App } from '../../apps/entities/app.entity';
import { Flow } from '../../flows/entities/flow.entity';

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

  flow: Flow;

  app: App;
}

export class ScreenDto {
  id: string;
  print: string;
  flow: number;
  app: number;
}
