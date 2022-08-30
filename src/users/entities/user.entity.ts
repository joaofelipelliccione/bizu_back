import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  MinLength,
  Length,
  IsEmail,
  Matches,
  IsBoolean,
} from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @MinLength(3, {
    message: 'O nome do usuário deve possuir, no mínimo, 3 caracteres.',
  })
  username: string;

  @Column({ length: 14 })
  @Length(14, 14, {
    message:
      'O CPF do usuário deve ser preenchido com pontos e hífen, totalizado 14 caracteres.',
  })
  userCPF: string;

  @Column({ length: 255 })
  @IsEmail()
  userMail: string;

  @Column({ length: 255 })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve possuir pelo menos 8 caracteres, um número e uma letra maiúscula.',
  })
  userPassword: string;

  @Column()
  @IsBoolean()
  isActive: boolean;
}
