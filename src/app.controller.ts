import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  // PING:
  @Throttle(5, 2 * 60)
  @Get()
  async ping() {
    return {
      statusCode: 200,
      message: 'API bizu design!',
    };
  }
}
