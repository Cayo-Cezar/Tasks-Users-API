import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global (recomendado)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // remove campos extras
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Tasks & Users API')
    .setDescription('Documentação e testes da API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
