import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/app.dto';
import { UpdateAppDto } from './dto/app.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  // CADASTRAR APP:
  @Post('new')
  create(@Body() newApp: CreateAppDto) {
    return this.appsService.create(newApp);
  }

  // ATUALIZAR USUÁRIO:
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() data: Partial<UpdateAppDto>) {
    return this.appsService.update(id, data);
  }

  // BUSCAR TODOS OS APPS:
  @Get()
  findAll() {
    return this.appsService.find();
  }

  // DELETAR APP:
  @Delete('remove/:id')
  async deleteApp(@Param('id') id: number) {
    return this.appsService.destroy(id);
  }
}
