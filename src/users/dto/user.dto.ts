import { MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  username: string;
  userMail: string;
  userPassword: string;
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
  userPassword: string;
}

export class UserDto extends CreateUserDto {
  userId: string;
}
