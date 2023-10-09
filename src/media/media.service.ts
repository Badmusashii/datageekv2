import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Like, Repository } from 'typeorm';
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
  async findMediaByTitle(
    partialTitle: string,
    platformId: number,
    userId: number,
  ) {
    // const media = await this.mediaRepository.findOne({ where: { title } });
    // const media = await this.mediaRepository
    //   .createQueryBuilder('media')
    //   .leftJoinAndSelect('media.platforms', 'platform')
    //   .leftJoinAndSelect('media.users', 'user')
    //   .where('media.title = :title', { title })
    //   .andWhere('platform.id = :platformId', { platformId })
    //   .andWhere('user.id = :userId', { userId })
    //   .getOne();

    // const media = await this.mediaRepository
    //   .createQueryBuilder('media')
    //   .leftJoinAndSelect('media.platforms', 'platform')
    //   .leftJoinAndSelect('media.users', 'user')
    //   .where('media.title LIKE :partialTitle', {
    //     partialTitle: `${partialTitle}%`,
    //   })
    //   .andWhere('platform.id = :platformId', { platformId })
    //   .andWhere('user.id = :userId', { userId })
    //   .getMany();

    // const media = await this.mediaRepository.findOne({
    //   where: { title: partialTitle },
    //   relations: ['platforms', 'users'],
    // });

    // const allMedia = await this.mediaRepository.find({
    //   relations: ['platforms', 'users'],
    // });

    const allMedia = await this.mediaRepository.find({
      relations: ['platforms', 'users'],
      where: {
        title: Like(`${partialTitle}%`),
        platforms: {
          id: platformId,
        },
      },
      join: {
        alias: 'media',
        leftJoinAndSelect: {
          platform: 'media.platforms',
          user: 'media.users',
        },
      },
    });

    // const media = allMedia.filter((media) =>
    //   media.title.startsWith(partialTitle),
    // );
    const media = allMedia.filter(
      (media) => media.title && media.title.startsWith(partialTitle),
    );

    if (!allMedia.length) {
      if (platformId > 0 && platformId < 4) {
        const tmbd = await this.movieBDD.searchMovie(partialTitle);
        return tmbd;
      } else {
        const giantbombData = await this.giantBomb.searchGame(partialTitle);
        // Traitez les données reçues si nécessaire
        return giantbombData;
      }
    }
    return media;
  }

  create(createMediaDto: CreateMediaDto) {
    return 'This action adds a new media';
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
