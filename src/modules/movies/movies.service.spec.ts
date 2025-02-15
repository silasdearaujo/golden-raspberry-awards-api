/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { Movie } from '@prisma/client';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let prismaService: PrismaService;

  const mockMovies: Movie[] = [
    {
      id: '1',
      year: 2020,
      title: 'Movie A',
      studios: 'Studio A',
      winner: false,
      producers: 'Producer A',
    },
    {
      id: '2',
      year: 2021,
      title: 'Movie B',
      studios: 'Studio B',
      winner: true,
      producers: 'Producer B',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('deve retornar todos os filmes', async () => {
    jest.spyOn(prismaService.movie, 'findMany').mockResolvedValue(mockMovies);

    const result = await moviesService.getAllMovies();

    expect(result).toEqual(mockMovies);
    expect(prismaService.movie.findMany).toHaveBeenCalledTimes(1);
  });

  it('deve retornar apenas os filmes vencedores', async () => {
    const winningMovies = mockMovies.filter((movie) => movie.winner);
    jest
      .spyOn(prismaService.movie, 'findMany')
      .mockResolvedValue(winningMovies);

    const result = await moviesService.getAllWinningMovies();

    expect(result).toEqual(winningMovies);
    expect(prismaService.movie.findMany).toHaveBeenCalledWith({
      where: { winner: true },
    });
  });

  it('deve retornar um array vazio se não houver filmes no banco', async () => {
    jest.spyOn(prismaService.movie, 'findMany').mockResolvedValue([]);

    const result = await moviesService.getAllMovies();

    expect(result).toEqual([]);
    expect(prismaService.movie.findMany).toHaveBeenCalledTimes(1);
  });

  it('deve retornar um array vazio se não houver filmes vencedores', async () => {
    jest.spyOn(prismaService.movie, 'findMany').mockResolvedValue([]);

    const result = await moviesService.getAllWinningMovies();

    expect(result).toEqual([]);
    expect(prismaService.movie.findMany).toHaveBeenCalledWith({
      where: { winner: true },
    });
  });
});
