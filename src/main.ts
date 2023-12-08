import { readFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

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
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       directives: {
  //         defaultSrc: ["'self'"], // Limite tout le contenu par défaut à ton propre serveur
  //         scriptSrc: ["'self'", 'https://localhost:4200'], // Autorise les scripts de ton serveur et des API
  //         imgSrc: [
  //           "'self'",
  //           'https://www.giantbomb.com/api',
  //           'https://api.themoviedb.org/3',
  //           'data:',
  //         ], // Autorise les images de sources spécifiques
  //         mediaSrc: ["'self'", 'https://api.themoviedb.org/3'],
  //         connectSrc: [
  //           "'self'",
  //           'https://localhost:8080',
  //           'https://www.giantbomb.com/api',
  //           'https://api.themoviedb.org/3',
  //         ], // Autorise les connexions WebSocket et API
  //         // frameSrc: ["'self'", 'https://www.adresse-tmdb.com'],

  //         // Ajoute d'autres directives au besoin
  //       },
  //     },
  //   }),
  // );

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
