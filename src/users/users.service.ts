import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { validate } from 'class-validator';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { GenericResponseDto } from '../dto/response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // BUSCAR USUÁRIO POR userMail. Utilizado dentro do service create():
  async findByUserMail(userMail: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userMail: userMail });
  }

  // CADASTRAR USUÁRIO:
  async create(data: CreateUserDto): Promise<GenericResponseDto> {
    const newUser = new User();
    newUser.username = data.username;
    newUser.userMail = data.userMail;
    newUser.userPassword = data.userPassword;

    const existentUser = await this.findByUserMail(data.userMail);
    if (existentUser !== null) {
      return {
        statusCode: 409,
        message: `Usuário já registrado.`,
      };
    }

    const validationErrors = await validate(newUser);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        message: `Erro de validação: ${
          Object.values(validationErrors[0].constraints)[0]
        }`,
      };
    }

    newUser.userPassword = bcrypt.hashSync(data.userPassword, 8); // Senha criptografada
    return this.userRepository
      .save(newUser)
      .then(() => {
        return {
          statusCode: 201,
          message: 'Usuário registrado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao registrar usuário: ${error}`,
        };
      });
  }

  // ATUALIZAR COLUNA lastSignIn. Utilizado dentro do controller login():
  async updateLastSignIn(token: string): Promise<any> {
    const { sub } = this.jwtService.decode(token); // sub é sinônimo de userId
    await this.userRepository.update(sub, { lastSignIn: () => 'NOW()' }); // Atualizará para data e hora do Login
  }

  // ATUALIZAR USUÁRIO:
  async update(
    token: string,
    data: Partial<UpdateUserDto>,
  ): Promise<GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);
    const existentUser = await this.userRepository.findOneBy({
      userId: sub,
    });

    if (existentUser === null) {
      return {
        statusCode: 404,
        message: `Usuário não encontrado :(`,
      };
    }

    const userToUpdate = new UpdateUserDto();
    userToUpdate.username = data.username;
    userToUpdate.userPassword = data.userPassword;

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
    if (data.userPassword) {
      userToUpdate.userPassword = bcrypt.hashSync(data.userPassword, 8); // Senha criptografada.
    }

    return await this.userRepository
      .update(sub, userToUpdate)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Usuário atualizado com sucesso!!',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao atualizar usuário: ${error}`,
        };
      });
  }

  // BUSCAR USUÁRIO POR TOKEN --> userId:
  async findUserByToken(
    token: string,
  ): Promise<Partial<User> | GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);

    try {
      const { userId, username, userMail } =
        await this.userRepository.findOneBy({
          userId: sub,
        });

      return { userId, username, userMail };
    } catch (error) {
      return {
        statusCode: 404,
        message: `Usuário não encontrado :(`,
      };
    }
  }

  // DELETAR USUÁRIO:
  async destroy(token: string): Promise<GenericResponseDto> {
    const { sub } = this.jwtService.decode(token);
    const existentUser = await this.userRepository.findOneBy({
      userId: sub,
    });

    if (existentUser === null) {
      return {
        statusCode: 404,
        message: `Usuário não encontrado :(`,
      };
    }

    return this.userRepository
      .delete({ userId: sub })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Usuário removido com sucesso.',
        };
      })
      .catch((error) => {
        return {
          statusCode: 500,
          message: `Erro ao remover usuário: ${error}`,
        };
      });
  }
}
