import { Module } from '@nestjs/common';

import { CsvService } from './csv.service';

@Module({
  imports: [],
  providers: [CsvService],
  exports: [CsvService],
})
export class CsvModule {}
