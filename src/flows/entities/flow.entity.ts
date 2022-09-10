import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MinLength } from 'class-validator';
import { Screen } from '../../screens/entities/screen.entity';

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

  // RELAÇÕES:
  @OneToMany(() => Screen, (screen) => screen.flow)
  screens: Screen[];
}
