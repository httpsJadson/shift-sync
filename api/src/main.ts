import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.ENVIRONMENT === 'development') {
    app.enableCors({
      origin: '*', // Allow all origins for development
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  
    const config = new DocumentBuilder()
      .setTitle('Shift Sync API')
      .setDescription('The Shift Sync API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  } else {
    app.enableCors({
      origin: process.env.FRONTEND_URL, // Replace with your production frontend URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
