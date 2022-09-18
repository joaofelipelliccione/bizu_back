import { MinLength } from 'class-validator';

export class CreateFlowDto {
  name: string;
  description: string;
}

export class UpdateFlowDto {
  @MinLength(3, {
    message: 'O nome do fluxo deve possuir, no mínimo, 3 caracteres.',
  })
  name: string;

  @MinLength(8, {
    message: 'A descrição do fluxo deve apresentar, no mínimo, 8 caracteres.',
  })
  description: string;
}

export class FlowDto extends CreateFlowDto {
  id: string;
}
