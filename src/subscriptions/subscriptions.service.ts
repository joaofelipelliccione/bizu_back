import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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

  // CRIAR PLANO DE ASSINATURA:
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

  // ATUALIZAR PLANO DE ASSINATURA:
  async update(
    subscriptionId: number,
    data: Partial<UpdateSubscriptionDto>,
  ): Promise<GenericResponseDto> {
    const existentSubscription = await this.subscriptionRepository.findOneBy({
      id: subscriptionId,
    });

    if (existentSubscription === null) {
      throw new NotFoundException('Plano de assinatura não encontrado :(');
    }

    const subscriptionToUpdate = new UpdateSubscriptionDto();
    subscriptionToUpdate.name = data.name;
    subscriptionToUpdate.price = data.price;
    subscriptionToUpdate.durationInMonths = data.durationInMonths;

    const validationErrors = await validate(subscriptionToUpdate, {
      skipMissingProperties: true,
    });
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return await this.subscriptionRepository
      .update(subscriptionId, subscriptionToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Plano de assinatura atualizado com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar plano de assinatura - ${error}`,
        };
      });
  }

  // BUSCAR TODOS OS PLANOS DE ASSINATURA:
  async findAll(): Promise<Subscription[] | GenericResponseDto> {
    return this.subscriptionRepository
      .find()
      .then((subscription) => subscription)
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao buscar planos de assinatura - ${error}`,
        };
      });
  }

  // DELETAR PLANO DE ASSINATURA:
  async destroy(subscriptionId: number): Promise<GenericResponseDto> {
    const existentSubscriptionPlan =
      await this.subscriptionRepository.findOneBy({
        id: subscriptionId,
      });

    if (existentSubscriptionPlan === null) {
      throw new NotFoundException('Plano de assinatura não encontrado :(');
    }

    return this.subscriptionRepository
      .delete({ id: subscriptionId })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Plano de assinatura removido com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover plano de assinatura - ${error}`,
        };
      });
  }
}
