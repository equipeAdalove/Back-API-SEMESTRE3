import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { swaggerCustomOptions } from './swagger/swagger.custom';
import { css } from './swagger/custom-css';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files from public directory
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  const config = new DocumentBuilder()
    .setTitle('🌎📈 AdaTrade API - Comércio Exterior Brasileiro')
    .setDescription(
      `
## 🚀 Sobre a API
API desenvolvida com NestJS para fornecer estatísticas detalhadas de Comércio Exterior do Brasil.

## 🔗 Documentação Interativa (Swagger)
Esta página utiliza **Swagger UI**, uma ferramenta que permite:
- 🧩 Visualizar todos os endpoints disponíveis
- 📖 Consultar a estrutura da API
- 🔍 Explorar modelos de dados e esquemas de resposta

## 📊 Fontes dos Dados
As informações foram obtidas a partir de dados abertos oficiais:
- 🗃️ [Base de Dados Bruta](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/base-de-dados-bruta)
- 📊 [ComexStat](https://comexstat.mdic.gov.br/pt/home)

## ⚠️ Aviso
Todos os endpoints são públicos e utilizam apenas métodos GET
`,
    )
    .setContact(
      'Equipe Adalove',
      'https://github.com/equipeAdalove',
      'adalove@email.com',
    )
    .setVersion('1.0')
    .build();

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger with custom options
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  // Start application
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}

bootstrap();
