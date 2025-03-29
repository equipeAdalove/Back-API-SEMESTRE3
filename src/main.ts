import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Permitir apenas o frontend local
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept', // Cabeçalhos permitidos
  });

  await app.listen(3000);
}
bootstrap();
