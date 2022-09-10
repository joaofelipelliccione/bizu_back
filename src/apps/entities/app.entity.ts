import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MinLength, IsEnum } from 'class-validator';
import { Platform } from '../enum/platform.enum';
import { Country } from '../../countries/entities/country.entity';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('enum', { nullable: false, enum: Platform })
  @IsEnum(Platform, {
    message: 'Plataformas aceitas: Mobile | Web.',
  })
  platform!: Platform;

  @Column('varchar', { nullable: false, length: 20 })
  @MinLength(1, {
    message: 'O nome do aplicativo deve possuir, no mínimo, 1 caractere.',
  })
  name!: string;

  @Column('varchar', { nullable: false })
  @MinLength(8, {
    message: 'O link do logotipo deve apresentar, no mínimo, 8 caracteres',
  })
  logo!: string;

  @Column('varchar', { nullable: false, length: 60 })
  @MinLength(3, {
    message: 'O slogan do aplicativo deve possuir, no mínimo, 3 caracteres.',
  })
  slogan!: string;

  @Column('varchar', { nullable: false })
  @MinLength(8, {
    message: 'O link do website deve apresentar, no mínimo, 8 caracteres',
  })
  websiteLink!: string;

  @Column('varchar', { nullable: false, length: 40 })
  @MinLength(3, {
    message: 'O categoria do aplicativo deve possuir, no mínimo, 3 caracteres.',
  })
  category!: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @Column({ nullable: true })
  lastUpdate: Date;

  // RELAÇÕES:
  @ManyToOne(() => Country, (country) => country.apps, {
    nullable: false,
    eager: true,
  })
  country!: Country;
}
