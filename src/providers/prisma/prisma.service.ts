import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CsvService } from '../csv/csv.service';
import { MovieCsvRow } from 'src/interfaces/movie-csv-row.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(
    private configService: ConfigService,
    private readonly csvService: CsvService,
  ) {
    super();
  }

  /**
   * Executado automaticamente quando o módulo é inicializado.
   * Estabelece conexão com o banco de dados e, se estiver em ambiente de desenvolvimento, popula a base de dados.
   *
   * @returns {Promise<void>}
   *
   * @example
   * await prismaService.onModuleInit();
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();

    await this.seedMoviesDatabase();
  }

  /**
   * Executado automaticamente quando o módulo é destruído.
   * Fecha a conexão com o banco de dados.
   *
   * @returns {Promise<void>}
   *
   * @example
   * await prismaService.onModuleDestroy();
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /**
   * Popula a base de dados com informações de um arquivo CSV caso a base esteja vazia.
   *
   * - Verifica se o banco já está populado.
   * - Valida o formato do CSV antes de importar os dados.
   * - Converte os dados do CSV para o formato esperado e insere no banco.
   *
   * @returns {Promise<void>}
   *
   * @example
   * await prismaService.seedMoviesDatabase();
   * // Logs possíveis:
   * // "Database já está populada"
   * // "CSV inválido! O processo de inserção foi abortado"
   * // "CSV vazio! Nenhum registro foi inserido"
   * // "Database populada com sucesso"
   */
  private async seedMoviesDatabase(): Promise<void> {
    try {
      const filePath = 'database/movies.csv';
      const expectedColumns = ['year', 'title', 'studios', 'producers'];

      // Apaga todo o conteúdo da tabela antes de inserir novamente
      await this.movie.deleteMany({});

      // Valida a estrutura do CSV (opcional)
      const isValid = await this.csvService.validateCsvLayout(
        filePath,
        expectedColumns,
      );

      if (!isValid) {
        this.logger.error('CSV inválido! O processo de inserção foi abortado');
        return;
      }

      // Lê e processa os dados do CSV
      const csvData =
        await this.csvService.parseCsvFileFromLocalPath<MovieCsvRow>(filePath);

      const movies = csvData.map((row) => ({
        year: parseInt(row.year, 10),
        title: row.title,
        studios: row.studios,
        producers: String(row.producers ?? ''),
        winner: row.winner?.toLowerCase() === 'yes',
      }));

      if (movies.length === 0) {
        this.logger.log('CSV vazio! Nenhum registro foi inserido');
        return;
      }

      // Insere os dados na base de dados
      await this.movie.createMany({ data: movies });

      this.logger.log('Database populada com sucesso');
    } catch (error) {
      this.logger.error('Erro ao popular database', error);
    }
  }
}
