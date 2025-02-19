import { Injectable, Logger } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';
import { ProducerInterval } from 'src/interfaces/producer-interval.interface';

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name);

  constructor(private moviesService: MoviesService) {}

  /**
   * Retorna um objeto contendo:
   * - min: lista de produtores com o menor intervalo
   * - max: lista de produtores com o maior intervalo
   *
   * Formato de retorno:
   * {
   *   min: ProducerInterval[],
   *   max: ProducerInterval[]
   * }
   */
  async getProducersIntervals() {
    const winningMovies = await this.moviesService.getAllWinningMovies();

    const producerMap: Record<string, number[]> = {};

    for (const movie of winningMovies) {
      if (!movie.producers) continue;

      const adjustedProducers = movie.producers
        .replace(/\s+and\s+/gi, ', ')
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      for (const producer of adjustedProducers) {
        if (!producerMap[producer]) {
          producerMap[producer] = [];
        }
        producerMap[producer].push(movie.year);
      }
    }

    const allIntervals: ProducerInterval[] = [];

    for (const [producer, years] of Object.entries(producerMap)) {
      if (years.length < 2) continue;

      const sortedYears = [...years].sort((a, b) => a - b);

      for (let i = 0; i < sortedYears.length - 1; i++) {
        const interval = sortedYears[i + 1] - sortedYears[i];

        allIntervals.push({
          producer,
          interval,
          previousWin: sortedYears[i],
          followingWin: sortedYears[i + 1],
        });
      }
    }

    if (allIntervals.length === 0) {
      return { min: [], max: [] };
    }

    const minInterval = Math.min(...allIntervals.map((item) => item.interval));
    const maxInterval = Math.max(...allIntervals.map((item) => item.interval));

    const min = allIntervals.filter((item) => item.interval === minInterval);
    const max = allIntervals.filter((item) => item.interval === maxInterval);

    return {
      min,
      max,
    };
  }
}
