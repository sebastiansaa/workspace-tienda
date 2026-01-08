import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './contexts/shared/filters/domain-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

import { ResponseMappingInterceptor } from './contexts/shared/interceptors/response-mapping.interceptor';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS: permite peticiones desde el frontend en localhost:5173 con cookies
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  // Seguridad básica con Helmet (cabeceras HTTP) y logging de requests con Morgan
  app.use(helmet());
  app.use(morgan('combined'));

  // Middleware para parsear cookies en las peticiones HTTP
  app.use(cookieParser());

  // Validación global de DTOs: limpia propiedades extra, transforma tipos y rechaza datos inválidos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Filtro global: mapea errores de dominio a respuestas HTTP uniformes
  app.useGlobalFilters(new DomainExceptionFilter());

  // Interceptor global: asegura consistencia en todas las respuestas { statusCode, message, data }
  app.useGlobalInterceptors(new ResponseMappingInterceptor(new Reflector()));

  // Prefijo global para todas las rutas de la API (ej: /api/users, /api/products)
  app.setGlobalPrefix('api');

  // Servir archivos estáticos (ej: imágenes de productos) desde la carpeta /public/uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));

  // Documentación Swagger habilitada solo en entornos no productivos
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tienda Lite API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Inicia la aplicación en el puerto definido por la variable de entorno PORT o en 3000 por defecto
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();