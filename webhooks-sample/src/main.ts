import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '6mb' }));

  await app.listen(3000);

  console.log(
    `Application listening on ${(await app.getUrl()).replace(
      '[::1]',
      'localhost',
    )}`,
  );
}
bootstrap();
