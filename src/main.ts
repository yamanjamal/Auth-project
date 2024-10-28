import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors();

  const config = await app.resolve(ConfigService);

  const APP_ROUTE_PREFIX = 'api';
  app.setGlobalPrefix(APP_ROUTE_PREFIX);

  // Swagger
  const documentBuilder = new DocumentBuilder()
    .setTitle('auth example')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup(`${APP_ROUTE_PREFIX}/docs`, app, document);

  await app.listen(config.get('PORT')!);
}
bootstrap();
