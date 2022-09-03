import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/app.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  // CADASTRAR APP:
  @Post('new')
  create(@Body() newApp: CreateAppDto) {
    return this.appsService.create(newApp);
  }

  // BUSCAR TODOS OS APPS:
  // @Get()
  // findAll() {
  //   return this.appsService.find();
  // }

  // DELETAR APP:
  // @Delete('remove/:id')
  // async deleteUser(@Param('id') id: number) {
  //   return this.appsService.destroy(id);
  // }
}
