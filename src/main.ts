import { readFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // Configuration des options HTTPS
  // Lecture des fichiers clés et certificats pour HTTPS
  const httpsOptions = {
    key: readFileSync('./private-key.pem'), // clé privée pour HTTPS
    passphrase: process.env.SSL_PASSPHRASE, // passphrase pour déverrouiller la clé privée
    cert: readFileSync('./certificate.pem'), // certificat public pour HTTPS (auto-signé dans ce cas)
  };

  // Création de l'application NestJS avec les options HTTPS
  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Utilisation de cookie-parser pour gérer les cookies
  app.use(cookieParser());

  // Activation des CORS pour le frontend
  app.enableCors({
    origin: 'https://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Datageek')
    .setDescription('La description de mon API DataGeek')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(8080);
}
bootstrap();
