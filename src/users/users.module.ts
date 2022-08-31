import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  providers: [...usersProviders, UsersService, JwtService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
