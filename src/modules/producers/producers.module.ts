import { Module } from '@nestjs/common';

import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [ProducersController],
  providers: [ProducersService],
})
export class ProducersModule {}
