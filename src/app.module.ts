import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserdgModule } from './userdg/userdg.module';
import { PlatformsModule } from './platforms/platforms.module';
import { MediaModule } from './media/media.module';
import { Userdg } from './userdg/entities/userdg.entity';
import { Platform } from './platforms/entities/platform.entity';
import { Media } from './media/entities/media.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GiantBombService } from './services/giant-bomb/giant-bomb.service';
import { MoviedatabaseService } from './services/moviedatabase/moviedatabase.service';
// Importation du middleware pour la limitation de taux de requetes
import { RateLimiterMiddleware } from 'middleware/limiter.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: String(process.env.DB_USERNAME),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Userdg, Media, Platform],
      synchronize: false,
      dropSchema: false,
      logging: true,
    }),
    AuthModule,
    UserdgModule,
    PlatformsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService, GiantBombService, MoviedatabaseService],
})
export class AppModule {
  // Cette méthode permet de configurer des middlewares pour certaines routes ou pour toutes les routes
  configure(consumer: MiddlewareConsumer) {
    // On applique le middleware de limitation de taux (RateLimiterMiddleware) à toutes les routes ('*')
    // Cela signifie que chaque requête entrante passera par ce middleware avant d'atteindre le contrôleur
    consumer.apply(RateLimiterMiddleware).forRoutes('*'); // Appliquer pour toutes les routes
  }
}
