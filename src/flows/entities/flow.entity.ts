import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MinLength } from 'class-validator';

@Entity()
export class Flow {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 40 })
  @MinLength(3, {
    message: 'O nome do fluxo deve possuir, no mínimo, 3 caracteres.',
  })
  name!: string;

  @Column('varchar', { nullable: false })
  @MinLength(8, {
    message: 'A descrição do fluxo deve apresentar, no mínimo, 8 caracteres.',
  })
  description!: string;
}
