import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // Backend
      'https://0005-220-76-70-1.ngrok-free.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  });

  // Add cookie-parser middleware
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
