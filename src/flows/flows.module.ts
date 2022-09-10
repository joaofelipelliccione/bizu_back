import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { flowsProviders } from './flows.providers';
import { FlowsService } from './flows.service';
import { FlowsController } from './flows.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...flowsProviders, FlowsService],
  controllers: [FlowsController],
  exports: [FlowsService],
})
export class FlowsModule {}
