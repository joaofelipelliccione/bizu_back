import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { MinLength } from 'class-validator';
import { Flow } from '../../flows/entities/flow.entity';

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

  // RELAÇÕES:
  @ManyToOne(() => Flow, (flow) => flow.screens, {
    nullable: false,
    eager: true,
  })
  flow!: Flow;
}
