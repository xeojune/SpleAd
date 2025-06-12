import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // Backend
      'https://0005-220-76-70-1.ngrok-free.app/link',  // Production
      'https://0005-220-76-70-1.ngrok-free.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
