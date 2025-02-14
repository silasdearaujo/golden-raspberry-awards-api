import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const configService = app.get(ConfigService);

  const appEnv = configService.get<string>('NODE_ENV');

  const appPort = configService.get<number>('API_PORT', 8080);

  const appName = configService.get<string>('API_NAME');

  const logger = new Logger(bootstrap.name);

  const logLevel: LogLevel[] =
    appEnv === 'production'
      ? ['warn', 'error', 'log']
      : ['debug', 'log', 'verbose', 'warn', 'error'];

  app.useLogger(logLevel);

  await app.listen(appPort, () =>
    logger.log(
      `🚀 ${appName} server is running! Listening on port ${appPort}.`,
    ),
  );
}
bootstrap();
