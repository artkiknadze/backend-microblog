import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Microblog API')
    .setDescription('Microblog API documentation')
    .setVersion('0.1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, documentBuilderConfig);
  SwaggerModule.setup('api', app, documentFactory());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
