import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

/**
 * O `CsvService` é responsável pela leitura de arquivos CSV e conversão de seu conteúdo em arrays
 * de objetos JSON. Ele faz uso da biblioteca `csv-parser` para processar cada linha do arquivo.
 */
@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  /**
   * Lê um arquivo CSV a partir de um caminho local e retorna seu conteúdo como um array de objetos JSON.
   *
   * @param filePath - Caminho (relativo ou absoluto) do arquivo CSV no sistema de arquivos.
   *
   * @returns Retorna uma `Promise<any[]>` que, ao ser resolvida, contém um array de objetos JSON.
   * Cada objeto representa uma linha do CSV, onde as chaves do objeto são os nomes das colunas do CSV.
   *
   * @example
   * ```ts
   * // Exemplo de uso em um Controller ou outro serviço
   * const data = await this.csvService.parseCsvFileFromLocalPath('database/movies.csv');
   * console.log(data);
   * // Saída esperada (exemplo):
   * // [
   * //   { "title": "O Poderoso Chefão", "year": "1972", "studios": "Associated Film Distribution", "producers": "Allan Carr", "winner": "yes" },
   * //   { "title": "Clube da Luta", "year": "1999", "studios": "Universal Studios, PolyGram", "producers": "Dyson Lovell", "winner": null },
   * //   ...
   * // ]
   * ```
   *
   * @throws Lança um erro (rejeita a Promise) caso o arquivo não seja encontrado ou haja falhas
   *         na leitura/conversão do CSV.
   */
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

  /**
   * Valida se o CSV possui todas as colunas esperadas no cabeçalho.
   *
   * @param filePath - Caminho do arquivo CSV no sistema de arquivos (pode ser relativo ou absoluto).
   * @param expectedColumns - Lista de colunas que devem estar presentes.
   *
   * @returns `Promise<boolean>`:
   *          - `true` se o arquivo contiver todas as colunas esperadas,
   *          - `false` caso contrário (ou se houver algum erro de leitura).
   *
   * @example
   * ```ts
   * const isValid = await this.csvService.validateCsvLayout(
   *   'database/movies.csv',
   *   ['title', 'year', 'director']
   * );
   * if (isValid) {
   *   console.log('Layout está correto!');
   * } else {
   *   console.log('Layout inválido ou erro ao ler o arquivo!');
   * }
   * ```
   */
  async validateCsvLayout(
    filePath: string,
    expectedColumns: string[],
  ): Promise<boolean> {
    return new Promise((resolve) => {
      let isValid = false;

      const stream = createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headers: string[]) => {
          //
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

          stream.destroy();
        })
        .on('error', (error) => {
          this.logger.error(
            `Erro ao validar layout do arquivo: ${filePath}: ${error.message}`,
          );
        })
        .on('end', () => {
          resolve(isValid);
        });
    });
  }
}
