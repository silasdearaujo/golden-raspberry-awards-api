import { Controller, Get } from '@nestjs/common';
import { ProducersService } from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get('intervals')
  async getProducersIntervals() {
    return this.producersService.getProducersIntervals();
  }
}
