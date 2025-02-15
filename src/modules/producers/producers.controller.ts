import { Controller, Get } from '@nestjs/common';
import { ProducersService } from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get('longest-interval')
  async getProducerWithLongestInterval() {
    return this.producersService.getProducerWithLongestInterval();
  }

  @Get('shortest-interval')
  async getProducerWithShortestInterval() {
    return this.producersService.getProducerWithShortestInterval();
  }
}
