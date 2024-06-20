import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('API DOCS')
    .setDescription('Ironfish Auth System API DOCS')
    .setVersion('1.0')
    .build();
  let swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

  swaggerDoc = {
    ...swaggerDoc,
    paths: Object.keys(swaggerDoc.paths).reduce((paths, path) => {
      paths[`/wallet${path}`] = swaggerDoc.paths[path];
      return paths;
    }, {})
  };

  SwaggerModule.setup('/docs', app, swaggerDoc);

  await app.listen(60013);
}
bootstrap();
