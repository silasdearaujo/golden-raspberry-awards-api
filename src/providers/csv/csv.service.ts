import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  /**
   * Lê e converte um arquivo CSV localizado no caminho especificado.
   *
   * - Lê o arquivo linha por linha.
   * - Converte os dados do CSV para um array de objetos.
   * - Utiliza `;` como separador padrão.
   *
   * @template T - Tipo dos objetos do array retornado.
   * @param {string} filePath - Caminho do arquivo CSV.
   * @returns {Promise<T[]>} - Um array de objetos representando os dados do CSV.
   *
   * @example
   * const data = await csvService.parseCsvFileFromLocalPath<MovieCsvRow>('database/movies.csv');
   * console.log(data);
   * // Saída esperada:
   * [
   *   { year: '2020', title: 'Movie Title', studios: 'Studio Name', producers: 'Producer Name', winner: 'yes' },
   *   { year: '2019', title: 'Another Movie', studios: 'Another Studio', producers: 'Another Producer', winner: 'no' }
   * ]
   */
  async parseCsvFileFromLocalPath<T = any>(filePath: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      this.logger.log(`Convertendo CSV do caminho: ${filePath}`);

      createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
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

  /**
   * Valida se um arquivo CSV possui todas as colunas esperadas.
   *
   * - Lê apenas o cabeçalho do arquivo.
   * - Verifica se todas as colunas esperadas estão presentes.
   * - Retorna `true` se todas as colunas forem encontradas, `false` caso contrário.
   *
   * @param {string} filePath - Caminho do arquivo CSV.
   * @param {string[]} expectedColumns - Lista de colunas esperadas.
   * @returns {Promise<boolean>} - `true` se o layout do CSV for válido, `false` se houver colunas ausentes ou erro de leitura.
   *
   * @example
   * const isValid = await csvService.validateCsvLayout('database/movies.csv', ['year', 'title', 'studios', 'producers']);
   * console.log(isValid); // true ou false
   *
   * @example
   * // Caso o arquivo tenha colunas faltando, um log será gerado:
   * // "Faltando colunas: [winner] no arquivo: database/movies.csv. Colunas encontradas: [year, title, studios, producers]."
   */
  async validateCsvLayout(
    filePath: string,
    expectedColumns: string[],
  ): Promise<boolean> {
    return new Promise((resolve) => {
      let isValid = false;

      const stream = createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('headers', (headers: string[]) => {
          const missingColumns = expectedColumns.filter(
            (col) => !headers.includes(col),
          );

          if (missingColumns.length === 0) {
            isValid = true;
            this.logger.log(`Layout válido para o arquivo: ${filePath}.`);
          } else {
            this.logger.warn(
              `Faltando colunas: [${missingColumns.join(', ')}] ` +
                `no arquivo: ${filePath}. Colunas encontradas: [${headers.join(', ')}].`,
            );
          }

          resolve(isValid);
          stream.destroy(); // Fecha o stream corretamente
        })
        .on('error', (error) => {
          this.logger.error(
            `Erro ao validar layout do arquivo: ${filePath}: ${error.message}`,
          );
          resolve(false);
        })
        .on('end', () => {
          if (!isValid) {
            resolve(false);
          }
        });
    });
  }
}
