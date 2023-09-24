import { Module } from '@nestjs/common';
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
    }),
    AuthModule,
    UserdgModule,
    PlatformsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
