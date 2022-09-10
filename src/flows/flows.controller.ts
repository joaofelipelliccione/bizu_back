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
import { FlowsService } from './flows.service';
import { CreateFlowDto, UpdateFlowDto } from './dto/flow.dto';

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  // CADASTRAR FLUXO:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('new')
  async create(@Body() newCountry: CreateFlowDto) {
    return await this.flowsService.create(newCountry);
  }

  // ATUALIZAR FLUXO:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() data: Partial<UpdateFlowDto>) {
    return await this.flowsService.update(id, data);
  }

  // BUSCAR TODOS OS FLUXOS:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.flowsService.findAll();
  }

  // DELETAR FLUXO:
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('remove/:id')
  async destroy(@Param('id') id: number) {
    return await this.flowsService.destroy(id);
  }
}
