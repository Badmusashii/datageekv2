import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { GiantBombService } from 'src/services/giant-bomb/giant-bomb.service';
import { MoviedatabaseService } from 'src/services/moviedatabase/moviedatabase.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly giantBomb: GiantBombService,
    private readonly movieBDD: MoviedatabaseService,
  ) {}

  async findMediaByTitle(title: string, platformId: number) {
    const media = await this.mediaRepository.findOne({ where: { title } });
    // const platformId = platformId;

    if (!media) {
      if (platformId > 0 && platformId < 4) {
        const tmbd = await this.movieBDD.searchMovie(title);
        return tmbd;
      } else {
        const giantbombData = await this.giantBomb.searchGame(title);
        // Traitez les données reçues si nécessaire
        return giantbombData;
      }
    }

    return media;
  }
}
