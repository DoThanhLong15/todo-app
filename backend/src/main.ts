import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const serverPort = configService.get<number>('app.port');

  if (!serverPort) {
    throw new Error('Server Port is not defined in configuration');
  }

  await app.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
  });
}
bootstrap();
