import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from './producers.service';
import { MoviesService } from '../movies/movies.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';

describe('ProducersService', () => {
  let producersService: ProducersService;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: MoviesService,
          useValue: {
            getAllWinningMovies: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    producersService = module.get<ProducersService>(ProducersService);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('deve retornar o produtor com o MAIOR intervalo entre prêmios consecutivos', async () => {
    (moviesService.getAllWinningMovies as jest.Mock).mockResolvedValue([
      { year: 1980, producers: 'John Doe' },
      { year: 1995, producers: 'John Doe' }, // Intervalo de 15 anos
      { year: 2020, producers: 'John Doe' }, // Intervalo de 25 anos (maior intervalo consecutivo)
      { year: 2001, producers: 'Jane Smith' },
      { year: 2005, producers: 'Jane Smith' }, // Intervalo de 4 anos
    ]);

    const result = await producersService.getProducerWithLongestInterval();

    expect(result).toEqual({
      producer: 'John Doe',
      interval: 25,
      previousWin: 1995,
      followingWin: 2020,
    });
  });

  it('deve retornar o produtor com o MENOR intervalo entre prêmios consecutivos', async () => {
    (moviesService.getAllWinningMovies as jest.Mock).mockResolvedValue([
      { year: 1980, producers: 'John Doe' },
      { year: 1995, producers: 'John Doe' }, // 15 anos
      { year: 2020, producers: 'John Doe' },
      { year: 2001, producers: 'Jane Smith' },
      { year: 2005, producers: 'Jane Smith' }, // 4 anos (menor intervalo consecutivo)
    ]);

    const result = await producersService.getProducerWithShortestInterval();

    expect(result).toEqual({
      producer: 'Jane Smith',
      interval: 4,
      previousWin: 2001,
      followingWin: 2005,
    });
  });

  it('deve retornar null se nenhum produtor tiver múltiplos prêmios', async () => {
    (moviesService.getAllWinningMovies as jest.Mock).mockResolvedValue([
      { year: 1990, producers: 'Single Producer' }, // Apenas um prêmio, sem consecutivos
    ]);

    const longestInterval =
      await producersService.getProducerWithLongestInterval();
    const shortestInterval =
      await producersService.getProducerWithShortestInterval();

    expect(longestInterval).toBeNull();
    expect(shortestInterval).toBeNull();
  });
});
