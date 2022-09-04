import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../enum/role.enum';
import { MinLength, IsEmail, Matches } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ length: 100 })
  @MinLength(3, {
    message: 'O nome do usuário deve possuir, no mínimo, 3 caracteres.',
  })
  username: string;

  @Column({ length: 255 })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve possuir pelo menos 8 caracteres, um número e uma letra maiúscula.',
  })
  password: string;

  @CreateDateColumn()
  signUp: Date;

  @Column()
  lastSignIn: Date;
}
