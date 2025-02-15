import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { CsvModule } from '../csv/csv.module';

@Module({
  imports: [CsvModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
