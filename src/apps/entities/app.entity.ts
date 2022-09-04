import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MinLength, IsEnum } from 'class-validator';
import { PlatformTypesEnum } from '../enum/platformTypes.enum';
import { Country } from '../../countries/entities/country.entity';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 7 })
  @IsEnum(PlatformTypesEnum, {
    message: 'Plataformas aceitas: Android | IOS | Both | Web.',
  })
  platform: string;

  @Column({ length: 20 })
  @MinLength(1, {
    message: 'O nome do aplicativo deve possuir, no mínimo, 1 caractere.',
  })
  name: string;

  @Column()
  @MinLength(8, {
    message: 'O link do logotipo deve apresentar, no mínimo, 8 caracteres',
  })
  logo: string;

  @Column({ length: 60 })
  @MinLength(3, {
    message: 'O slogan do aplicativo deve possuir, no mínimo, 3 caracteres.',
  })
  slogan: string;

  @Column()
  @MinLength(8, {
    message: 'O link do website deve apresentar, no mínimo, 8 caracteres',
  })
  websiteLink: string;

  @Column()
  @MinLength(3, {
    message: 'O categoria do aplicativo deve possuir, no mínimo, 3 caracteres.',
  })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  lastUpdate: Date;

  // RELAÇÕES:
  @ManyToOne(() => Country, (country) => country.apps, { eager: true })
  country: Country;
}
