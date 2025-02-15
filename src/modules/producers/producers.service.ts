import { Injectable, Logger } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';
import { ProducerInterval } from 'src/interfaces/producer-interval.interface';

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name);

  constructor(private moviesService: MoviesService) {}

  /**
   * Calcula o produtor com o maior ou menor intervalo entre prêmios consecutivos.
   *
   * @param {boolean} findMax - Define se deve buscar o maior (`true`) ou menor (`false`) intervalo.
   * @returns {Promise<ProducerInterval | null>} - Retorna o produtor correspondente ou `null` caso não haja produtores com prêmios consecutivos.
   *
   * @example
   * const result = await producersService.getProducerInterval(true);
   * console.log(result);
   * // Saída para maior intervalo:
   * {
   *   producer: 'John Doe',
   *   interval: 25,
   *   previousWin: 1995,
   *   followingWin: 2020
   * }
   *
   * const result2 = await producersService.getProducerInterval(false);
   * console.log(result2);
   * // Saída para menor intervalo:
   * {
   *   producer: 'Jane Smith',
   *   interval: 4,
   *   previousWin: 2001,
   *   followingWin: 2005
   * }
   */
  private async getProducerInterval(
    findMax: boolean,
  ): Promise<ProducerInterval | null> {
    const winningMovies = await this.moviesService.getAllWinningMovies();
    const producerMap: Record<string, number[]> = {};

    for (const movie of winningMovies) {
      const producerRaw = movie.producers as string;

      if (!producerRaw || producerRaw.trim() === '') continue;

      const producers = producerRaw.split(',').map((p) => p.trim());

      for (const prod of producers) {
        if (!prod) continue;

        if (!producerMap[prod]) {
          producerMap[prod] = [];
        }
        producerMap[prod].push(movie.year);
      }
    }

    let bestProducer: string | null = null;
    let bestInterval = findMax ? 0 : Infinity;
    let previousWin = 0;
    let followingWin = 0;

    for (const [producer, years] of Object.entries(producerMap)) {
      if (years.length < 2) continue;

      const sortedYears = [...years].sort((a, b) => a - b);

      for (let i = 0; i < sortedYears.length - 1; i++) {
        const interval = sortedYears[i + 1] - sortedYears[i];

        if (
          (findMax && interval > bestInterval) ||
          (!findMax && interval < bestInterval)
        ) {
          bestInterval = interval;
          bestProducer = producer;
          previousWin = sortedYears[i];
          followingWin = sortedYears[i + 1];
        }
      }
    }

    if (!bestProducer) {
      return null;
    }

    return {
      producer: bestProducer,
      interval: bestInterval,
      previousWin,
      followingWin,
    };
  }

  /**
   * Retorna o produtor que teve o maior intervalo entre duas vitórias consecutivas.
   *
   * @returns {Promise<ProducerInterval | null>} - O produtor com o maior intervalo ou `null` caso não haja.
   *
   * @example
   * const result = await producersService.getProducerWithLongestInterval();
   * console.log(result);
   * // Saída esperada:
   * {
   *   producer: 'John Doe',
   *   interval: 25,
   *   previousWin: 1995,
   *   followingWin: 2020
   * }
   */
  async getProducerWithLongestInterval(): Promise<ProducerInterval | null> {
    return this.getProducerInterval(true);
  }

  /**
   * Retorna o produtor que teve o menor intervalo entre duas vitórias consecutivas.
   *
   * @returns {Promise<ProducerInterval | null>} - O produtor com o menor intervalo ou `null` caso não haja.
   *
   * @example
   * const result = await producersService.getProducerWithShortestInterval();
   * console.log(result);
   * // Saída esperada:
   * {
   *   producer: 'Jane Smith',
   *   interval: 4,
   *   previousWin: 2001,
   *   followingWin: 2005
   * }
   */
  async getProducerWithShortestInterval(): Promise<ProducerInterval | null> {
    return this.getProducerInterval(false);
  }
}
