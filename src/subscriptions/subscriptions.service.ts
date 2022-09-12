import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { GenericResponseDto } from '../common/dto/response.dto';
import { validate } from 'class-validator';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject('SUBSCRIPTION_REPOSITORY')
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  // BUSCAR ASSINATURA POR name. Utilizado dentro do service create():
  async findOneBySubscriptionName(
    subscriptionName: string,
  ): Promise<Subscription | null> {
    return await this.subscriptionRepository.findOneBy({
      name: subscriptionName,
    });
  }

  // CRIAR TIPO ASSINATURA:
  async create(data: CreateSubscriptionDto): Promise<GenericResponseDto> {
    const existentSubscription = await this.findOneBySubscriptionName(
      data.name,
    );
    if (existentSubscription !== null) {
      throw new ConflictException('Plano de assinatura já registrado.');
    }

    const newSubscription = new Subscription();
    newSubscription.name = data.name;
    newSubscription.price = data.price;
    newSubscription.durationInMonths = data.durationInMonths;

    const validationErrors = await validate(newSubscription);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return this.subscriptionRepository
      .save(data)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Novo plano de assinatura criado com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao criar plano de assinatura - ${error}`,
        };
      });
  }
}
