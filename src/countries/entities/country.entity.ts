import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MinLength } from 'class-validator';

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
  @MinLength(1, {
    message:
      'O link da imagem da bandeira do país deve possuir, no mínimo, 1 carácter.',
  })
  countryFlag: string;
}
