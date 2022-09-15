import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  // RELAÇÕES:
  @ManyToOne(() => User, (user) => user.favoriteScreens, {
    nullable: false,
  })
  user: User;

  @OneToOne(() => Screen)
  @JoinColumn()
  screen: Screen;
}
