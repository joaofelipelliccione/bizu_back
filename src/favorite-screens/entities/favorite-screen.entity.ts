import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Screen } from '../../screens/entities/screen.entity';

@Entity()
export class FavoriteScreen {
  @PrimaryGeneratedColumn()
  id!: number;

  // RELAÇÕES:
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Screen)
  @JoinColumn()
  screen: Screen;
}
