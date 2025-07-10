import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    
    const app = await NestFactory.create(AppModule);
    console.log('NestJS application created successfully');

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // CORS configuration
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Rewards API')
      .setDescription('A comprehensive rewards management API with user points tracking, transactions, and redemption functionality')
      .setVersion('1.0')
      .addTag('rewards', 'Rewards management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const port = process.env.PORT || 8000;
    await app.listen(port, '0.0.0.0');
    console.log(`Rewards API is running on http://0.0.0.0:${port}`);
    console.log(`Swagger documentation available at http://0.0.0.0:${port}/api-docs`);
  } catch (error) {
    console.error('Failed to start NestJS application:', error);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});
