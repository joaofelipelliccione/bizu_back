import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { GenericResponseDto } from '../common/dto/response.dto';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject('SUBSCRIPTION_REPOSITORY')
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  // BUSCAR USUÁRIO POR email. Utilizado dentro do service create():
  async findOneByUserMail(userMail: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email: userMail });
  }

  // CADASTRAR USUÁRIO:
  async create(data: CreateUserDto): Promise<GenericResponseDto> {
    const existentUser = await this.findOneByUserMail(data.email);
    if (existentUser !== null) {
      throw new ConflictException('Usuário já registrado.');
    }

    const freeSubscriptionPlan = await this.subscriptionRepository.findOneBy({
      id: 1,
    });

    const newUser = new User();
    newUser.username = data.username;
    newUser.email = data.email;
    newUser.password = data.password;
    newUser.subscription = freeSubscriptionPlan;

    const validationErrors = await validate(newUser);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    newUser.password = bcrypt.hashSync(data.password, 8); // Senha criptografada
    return this.userRepository
      .save(newUser)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Usuário registrado com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar usuário - ${error}`,
        };
      });
  }

  // ATUALIZAR COLUNA lastSignIn. Utilizado dentro do controller login():
  async updateLastSignIn(token: string): Promise<any> {
    const { sub } = this.jwtService.decode(token); // sub é sinônimo de id do usuário
    await this.userRepository.update(sub, { lastSignIn: () => 'NOW()' }); // Atualizará para data e hora do Login
  }

  // ATUALIZAR USUÁRIO:
  async update(
    token: string,
    data: Partial<UpdateUserDto>,
  ): Promise<GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);

    const existentUser = await this.userRepository.findOneBy({
      id: sub,
    });

    if (existentUser === null) {
      throw new NotFoundException(
        'Impossível atualizar pois usuário não foi encontrado.',
      );
    }

    const userToUpdate = new UpdateUserDto();
    userToUpdate.username = data.username;
    userToUpdate.password = data.password;
    userToUpdate.profilePicture = data.profilePicture;
    userToUpdate.subscription = data.subscription;

    const validationErrors = await validate(userToUpdate, {
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

    // Caso haja atualização de senha:
    if (data.password) {
      userToUpdate.password = bcrypt.hashSync(data.password, 8); // Senha criptografada.
    }

    return this.userRepository
      .update(sub, userToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Usuário atualizado com sucesso!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar usuário - ${error}`,
        };
      });
  }

  // BUSCAR USUÁRIO POR TOKEN --> id do usuário:
  async findOneByUserToken(
    token: string,
  ): Promise<Partial<User> | GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);

    const existentUser = await this.userRepository.findOneBy({
      id: sub,
    });

    if (existentUser === null) {
      throw new NotFoundException('Usuário não encontrado :(');
    }

    return {
      id: existentUser.id,
      username: existentUser.username,
      email: existentUser.email,
      profilePicture: existentUser.profilePicture,
      subscription: existentUser.subscription,
      role: existentUser.role,
    };
  }

  // DELETAR USUÁRIO:
  async destroy(token: string): Promise<GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);

    const existentUser = await this.userRepository.findOneBy({
      id: sub,
    });

    if (existentUser === null) {
      throw new NotFoundException('Usuário não encontrado :(');
    }

    return this.userRepository
      .delete({ id: sub })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Usuário removido com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover usuário - ${error}`,
        };
      });
  }
}
