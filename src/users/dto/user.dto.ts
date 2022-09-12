import { MinLength, Matches } from 'class-validator';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Role } from '../enum/role.enum';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  subscription: Subscription;
}

export class UpdateUserDto {
  @MinLength(3, {
    message: 'O nome do usuário deve possuir, no mínimo, 3 caracteres.',
  })
  username: string;

  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve possuir pelo menos 8 caracteres, um número e uma letra maiúscula.',
  })
  password: string;

  @MinLength(8, {
    message:
      'O link da foto de perfil deve apresentar, no mínimo, 8 caracteres.',
  })
  profilePicture: string;

  subscription: Subscription;
}

export class UserDto extends CreateUserDto {
  id: string;
  role: Role;
  profilePicture: string;
}
