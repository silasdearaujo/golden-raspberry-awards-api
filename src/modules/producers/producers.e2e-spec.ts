import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('Producers Intervals (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/producers/intervals (GET) - Deve retornar min e max de acordo com o CSV', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/producers/intervals')
      .expect(200);

    expect(body).toMatchSnapshot();
  });
});
