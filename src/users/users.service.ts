import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { GenericResponseDto } from '../dto/response.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
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

  async create(data: CreateUserDto): Promise<GenericResponseDto> {
    const newUser = new User();
    newUser.username = data.username;
    newUser.userMail = data.userMail;
    newUser.userPassword = bcrypt.hashSync(data.userPassword, 8); // Senha criptografada

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
}
