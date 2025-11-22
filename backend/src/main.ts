import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeederService } from './database/seeds/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: true, // En desarrollo permite todas las origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('eSports Platform API')
    .setDescription('API para la plataforma de eSports - Gestión de torneos, equipos, usuarios y más')
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('usuarios', 'Gestión de usuarios')
    .addTag('torneos', 'Gestión de torneos')
    .addTag('equipos', 'Gestión de equipos')
    .addTag('juegos', 'Gestión de juegos')
    .addTag('tienda', 'Tienda de items')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'eSports Platform API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Ejecutar seeds solo si la variable de entorno SKIP_SEEDS no está presente
  if (process.env.SKIP_SEEDS !== 'true') {
    const seederService = app.get(SeederService);
    try {
      await seederService.seed();
    } catch (error) {
      console.error('❌ Error ejecutando seeds:', error.message);
    }
  }

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Aplicación ejecutándose en http://localhost:${port}`);
  console.log(`📚 API disponible en http://localhost:${port}/api`);
  console.log(`📖 Documentación Swagger en http://localhost:${port}/api/docs`);
  console.log(`🔓 CORS habilitado para desarrollo`);
}

bootstrap();
