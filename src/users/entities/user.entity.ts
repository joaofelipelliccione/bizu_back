import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MinLength, IsEmail, Matches, IsBoolean } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ length: 100 })
  @MinLength(3, {
    message: 'O nome do usuário deve possuir, no mínimo, 3 caracteres.',
  })
  username: string;

  @Column({ length: 255 })
  @IsEmail()
  userMail: string;

  @Column({ length: 255 })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve possuir pelo menos 8 caracteres, um número e uma letra maiúscula.',
  })
  userPassword: string;
}
