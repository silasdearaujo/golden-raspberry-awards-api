import { Module } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { PrismaModule } from 'src/providers/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
