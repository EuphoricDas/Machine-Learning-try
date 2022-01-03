import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';
// import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app/app.module';
import { ClientApiModule } from './app/client-api.module';
import { SessionJoinDTO, VideoSessionJoinDTO } from './app/dto/video-session';
import { RestApiModule } from './app/rest-api.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '6mb' }));

  app.enableCors({
    allowedHeaders: '*',
    credentials: true,
    methods: '*',
    origin: '*'
  });

  // app.useWebSocketAdapter(new RedisIoAdapter(app));

  // const globalPrefix = 'api'
  // app.setGlobalPrefix(globalPrefix)

  const restApiOptions = new DocumentBuilder()
    .setTitle('Videoflo REST API')
    .setDescription('Videoflo REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const restApiDocument = SwaggerModule.createDocument(app, restApiOptions, {
    include: [RestApiModule]
  });

  SwaggerModule.setup('rest-api-docs', app, restApiDocument);

  const clientApiOptions = new DocumentBuilder()
    .setTitle('Videoflo Client SDK API')
    .setDescription('Videoflo Client SDK API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const clientApiDocument = SwaggerModule.createDocument(app, clientApiOptions, {
    extraModels: [SessionJoinDTO, VideoSessionJoinDTO],
    include: [ClientApiModule]
  });

  SwaggerModule.setup('client-api-docs', app, clientApiDocument);

  const port = process.env.PORT || 3333;

  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
