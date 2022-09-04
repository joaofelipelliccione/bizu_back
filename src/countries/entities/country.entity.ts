import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MinLength } from 'class-validator';
import { App } from '../../apps/entities/app.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  countryId: number;

  @Column({ length: 30 })
  @MinLength(3, {
    message: 'O nome do país deve possuir, no mínimo, 3 caracteres.',
  })
  countryName: string;

  @Column()
  @MinLength(8, {
    message:
      'O link da imagem da bandeira do país deve apresentar, no mínimo, 8 caracteres.',
  })
  countryFlag: string;

  // RELAÇÕES:
  @OneToMany(() => App, (app) => app.appCountry)
  apps: App[];
}
