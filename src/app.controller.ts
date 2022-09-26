import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // PING:
  @Get()
  async ping() {
    return {
      statusCode: 200,
      message: 'API bizu design!',
    };
  }
}
