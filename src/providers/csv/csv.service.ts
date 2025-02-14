import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  async parseCsvFileFromLocalPath(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      this.logger.log(`Convertendo CSV do caminho: ${filePath}`);

      createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve(results);

          this.logger.log(
            `Sucesso ao converter CSV do caminho: ${filePath}, total de registros: ${results.length}`,
          );
        })
        .on('error', (error) => {
          reject(error);

          this.logger.error(
            `Erro ao converter CSV do caminho: ${filePath}: ${error.message}`,
          );
        });
    });
  }
}
