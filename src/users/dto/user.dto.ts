export class CreateUserDto {
  username: string;
  userMail: string;
  userPassword: string;
}

export class UpdateUserDto {
  username: string;
  userPassword: string;
}

export class UserDto extends CreateUserDto {
  userId: string;
}
