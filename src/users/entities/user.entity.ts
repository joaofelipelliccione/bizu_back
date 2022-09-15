import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MinLength, IsEmail, Matches } from 'class-validator';
import { Role } from '../enum/role.enum';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { FavoriteScreen } from '../../favorite-screens/entities/favorite-screen.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('enum', { nullable: false, enum: Role, default: Role.USER })
  role!: Role;

  @Column('varchar', { nullable: false, length: 100 })
  @MinLength(3, {
    message: 'O nome do usuário deve possuir, no mínimo, 3 caracteres.',
  })
  username!: string;

  @Column('varchar', { nullable: false, length: 255 })
  @IsEmail()
  email!: string;

  @Column('varchar', { nullable: false, length: 255 })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve possuir pelo menos 8 caracteres, um número e uma letra maiúscula.',
  })
  password!: string;

  @Column('varchar', {
    nullable: false,
    default: 'https://default-profile-image-png-1-Transparent-Images.png',
  })
  profilePicture!: string;

  @Column('varchar', { nullable: false, default: false })
  isVerified!: boolean;

  @CreateDateColumn({ nullable: false })
  signUp!: Date;

  @Column({ nullable: true })
  lastSignIn: Date;

  // RELAÇÕES:
  @ManyToOne(() => Subscription, (subscription) => subscription.users, {
    nullable: false,
    eager: true,
  })
  subscription!: Subscription;

  @OneToMany(() => FavoriteScreen, (favoriteScreen) => favoriteScreen.user, {
    nullable: false,
    eager: true,
  })
  favoriteScreens!: FavoriteScreen[];
}
