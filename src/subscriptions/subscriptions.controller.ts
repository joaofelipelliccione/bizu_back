import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // CRIAR PLANO DE ASSINATURA:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() newSubscription: CreateSubscriptionDto) {
    return await this.subscriptionsService.create(newSubscription);
  }

  // ATUALIZAR PLANO DE ASSINATURA:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<UpdateSubscriptionDto>,
  ) {
    return await this.subscriptionsService.update(id, data);
  }

  // BUSCAR TODOS OS PLANOS DE ASSINATURA:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.subscriptionsService.findAll();
  }

  // DELETAR PLANO DE ASSINATURA:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async destroy(@Param('id') id: number) {
    return await this.subscriptionsService.destroy(id);
  }
}
