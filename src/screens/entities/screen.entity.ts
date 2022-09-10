import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MinLength } from 'class-validator';

@Entity()
export class Screen {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false })
  @MinLength(8, {
    message:
      'O link do print da tela deve apresentar, no mínimo, 8 caracteres.',
  })
  print!: string;
}
