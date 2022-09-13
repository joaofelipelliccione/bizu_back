import { User } from '../../users/entities/user.entity';
import { Screen } from '../../screens/entities/screen.entity';

export class CreateFavoriteScreenDto {
  user: User;
  screen: Screen;
}
