import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MinLength } from 'class-validator';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 30 })
  @MinLength(4, {
    message: 'O nome da assinatura deve possuir, no mínimo, 4 caracteres.',
  })
  name!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  price!: number;

  @Column('int', { nullable: true })
  durationInMonths: number;

  // RELAÇÕES:
}
