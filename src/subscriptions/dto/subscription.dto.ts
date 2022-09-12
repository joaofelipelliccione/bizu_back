import { MinLength } from 'class-validator';

export class CreateSubscriptionDto {
  name: string;
  price: number;
  durationInMonths: number;
}

export class UpdateSubscriptionDto {
  @MinLength(4, {
    message: 'O nome da assinatura deve possuir, no mínimo, 4 caracteres.',
  })
  name: string;

  price: number;
  durationInMonths: number;
}

export class SubscriptionDto extends CreateSubscriptionDto {
  id: string;
}
