import { Injectable, Logger } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(private prismaService: PrismaService) {}

  /**
   * Retorna todos os filmes cadastrados no banco de dados.
   *
   * @returns {Promise<Movie[]>} - Uma lista de filmes.
   *
   * @example
   * const movies = await moviesService.getAllMovies();
   * console.log(movies);
   * // Saída:
   * [
   *   {
   *     id: '123',
   *     year: 2020,
   *     title: 'Movie Title',
   *     studios: 'Studio Name',
   *     winner: false,
   *     producers: 'Producer Name'
   *   }
   * ]
   */
  async getAllMovies(): Promise<Movie[]> {
    const movies = await this.prismaService.movie.findMany();
    return movies;
  }

  /**
   * Retorna todos os filmes vencedores de prêmios.
   *
   * @returns {Promise<Movie[]>} - Uma lista de filmes vencedores.
   *
   * @example
   * const winningMovies = await moviesService.getAllWinningMovies();
   * console.log(winningMovies);
   * // Saída:
   * [
   *   {
   *     id: '456',
   *     year: 2018,
   *     title: 'Winning Movie',
   *     studios: 'Famous Studio',
   *     winner: true,
   *     producers: 'Top Producer'
   *   }
   * ]
   */
  async getAllWinningMovies(): Promise<Movie[]> {
    const winningMovies = await this.prismaService.movie.findMany({
      where: { winner: true },
    });

    return winningMovies;
  }
}
