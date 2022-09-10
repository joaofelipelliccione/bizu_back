import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Flow } from './entities/flow.entity';
import { CreateFlowDto, UpdateFlowDto } from './dto/flow.dto';
import { GenericResponseDto } from '../common/dto/response.dto';

@Injectable()
export class FlowsService {
  constructor(
    @Inject('FLOW_REPOSITORY')
    private flowRepository: Repository<Flow>,
  ) {}

  // BUSCAR FLUXO POR name. Utilizado dentro do service create():
  async findOneByFlowName(flowName: string): Promise<Flow | null> {
    return await this.flowRepository.findOneBy({ name: flowName });
  }

  // CADASTRAR FLUXO:
  async create(data: CreateFlowDto): Promise<GenericResponseDto> {
    try {
      const existentFlow = await this.findOneByFlowName(data.name);
      if (existentFlow !== null) {
        return {
          statusCode: 409,
          message: `Fluxo já registrado.`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de fluxo pré registro: ${error}`,
      };
    }

    const newFlow = new Flow();
    newFlow.name = data.name;
    newFlow.description = data.description;

    const validationErrors = await validate(newFlow);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    return this.flowRepository
      .save(newFlow)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Fluxo registrado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar fluxo: ${error}`,
        };
      });
  }

  // ATUALIZAR PAÍS:
  async update(
    flowId: number,
    data: Partial<UpdateFlowDto>,
  ): Promise<GenericResponseDto> {
    try {
      const existentFlow = await this.flowRepository.findOneBy({
        id: flowId,
      });

      if (existentFlow === null) {
        return {
          statusCode: 404,
          message: `Fluxo não encontrado :(`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de fluxo pré atualização: ${error}`,
      };
    }

    const flowToUpdate = new UpdateFlowDto();
    flowToUpdate.name = data.name;
    flowToUpdate.description = data.description;

    const validationErrors = await validate(flowToUpdate, {
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

    return await this.flowRepository
      .update(flowId, flowToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Fluxo atualizado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar fluxo: ${error}`,
        };
      });
  }

  // DELETAR FLUXO:
  async destroy(flowId: number): Promise<GenericResponseDto> {
    try {
      const existentFlow = await this.flowRepository.findOneBy({
        id: flowId,
      });

      if (existentFlow === null) {
        return {
          statusCode: 404,
          message: `Fluxo não encontrado :(`,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `Erro ao verificar existência de fluxo pré deleção: ${error}`,
      };
    }

    return this.flowRepository
      .delete({ id: flowId })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Fluxo removido com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover Fluxo: ${error}`,
        };
      });
  }
}
