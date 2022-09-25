import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MinLength, IsEnum } from 'class-validator';
import { Platform } from '../enum/platform.enum';
import { Category } from '../../categories/entities/category.entity';
import { Country } from '../../countries/entities/country.entity';
import { Screen } from '../../screens/entities/screen.entity';

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
    message: 'O nome da aplicação deve possuir, no mínimo, 1 caractere.',
  })
  name!: string;

  @Column('varchar', { nullable: false })
  @MinLength(8, {
    message: 'O link do logotipo deve apresentar, no mínimo, 8 caracteres',
  })
  logo!: string;

  @Column('varchar', { nullable: false, length: 60 })
  @MinLength(3, {
    message: 'O slogan da aplicação deve possuir, no mínimo, 3 caracteres.',
  })
  slogan!: string;

  @Column('varchar', { nullable: false })
  @MinLength(8, {
    message: 'O link do website deve apresentar, no mínimo, 8 caracteres',
  })
  websiteLink!: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @Column({ nullable: true })
  lastUpdate: Date;

  // RELAÇÕES:
  @ManyToOne(() => Category, (category) => category.apps, {
    nullable: false,
  })
  category!: Category;

  @ManyToOne(() => Country, (country) => country.apps, {
    nullable: false,
  })
  country!: Country;

  @OneToMany(() => Screen, (screen) => screen.app, {
    nullable: false,
  })
  screens!: Screen[];
}
