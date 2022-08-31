import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { GenericResponseDto } from '../dto/response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') // Vêm do arquivo users.providers.ts
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUserMail(userMail: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userMail: userMail });
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userId: userId });
  }

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

  async update(
    id: string,
    data: Partial<UpdateUserDto>,
  ): Promise<GenericResponseDto> {
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

    // Caso o usuário queira atualizar sua senha
    if (data.userPassword) {
      userToUpdate.userPassword = bcrypt.hashSync(data.userPassword, 8); // Senha criptografada
    }

    return await this.userRepository
      .update(id, userToUpdate)
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
}
