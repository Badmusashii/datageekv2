import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media } from './entities/media.entity';
import { GiantBombService } from 'src/services/giant-bomb/giant-bomb.service';
import { MoviedatabaseService } from 'src/services/moviedatabase/moviedatabase.service';
@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService, GiantBombService, MoviedatabaseService],
  exports: [MediaService, TypeOrmModule.forFeature([Media])],
})
export class MediaModule {}
