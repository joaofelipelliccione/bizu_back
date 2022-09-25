import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MinLength } from 'class-validator';
import { App } from '../../apps/entities/app.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 30 })
  @MinLength(3, {
    message: 'O nome da categoria deve possuir, no mínimo, 3 caracteres.',
  })
  name!: string;

  // RELAÇÕES:
  @OneToMany(() => App, (app) => app.category)
  apps: App[];
}
