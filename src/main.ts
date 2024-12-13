import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerDocumentOptions,
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  // Create the app
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // CORS config
  app.enableCors();

  // API versioning and prefix
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };

  const swaggerconfig = new DocumentBuilder()
    .setTitle(`bank checkin ${process.env.ENV_NAME} app API`)
    .setDescription(
      `This comprehensive API documentation serves as the authoritative guide for developers integrating with the bank checkin app backend developers, a robust system engineered to streamline matrimonial services.`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerconfig,
    swaggerDocumentOptions,
  );
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT, () =>
    console.log(`Server is running on port: ${process.env.PORT}`),
  );
}
bootstrap();
