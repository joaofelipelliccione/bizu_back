import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Screen } from '../../screens/entities/screen.entity';

@Entity()
export class FavoriteScreen {
  @PrimaryGeneratedColumn()
  id!: number;

  // RELAÇÕES:
  @ManyToOne(() => User, (user) => user.favoriteScreens, {
    nullable: false,
  })
  user: User;

  @OneToOne(() => Screen)
  @JoinColumn()
  screen: Screen;
}
