import { Injectable, Logger } from '@nestjs/common';
import * as csv from 'csv-parser';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  constructor() {}
}
