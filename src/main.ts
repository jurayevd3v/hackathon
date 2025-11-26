import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORS sozlamalari ---
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  // --- Global prefix ---
  app.setGlobalPrefix('api');

  // --- Validation pipe ---
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // --- API versioning ---
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // --- Request logger ---
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.originalUrl} Status: ${res.statusCode} (${duration}ms)\n------------------------`,
      );
    });
    next();
  });

  // --- Swagger sozlamalari ---
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hackathon')
    .setDescription('API docs. Developer: Dev')
    .setVersion('1.0.0')
    .addServer('https://dev.ithubs.uz/hackathon', 'Production server')
    .addServer('http://localhost:6000', 'Local server')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const PORT = Number(process.env.API_PORT) || 9999;
  await app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}/api/docs`);
  });
}

bootstrap();
