import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Like, Repository } from 'typeorm';
import { GiantBombService } from 'src/services/giant-bomb/giant-bomb.service';
import { MoviedatabaseService } from 'src/services/moviedatabase/moviedatabase.service';
import { Userdg } from 'src/userdg/entities/userdg.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly giantBomb: GiantBombService,
    private readonly movieBDD: MoviedatabaseService,
    @InjectRepository(Userdg)
    private userRepository: Repository<Userdg>,
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
    // const media = allMedia.filter(
    //   (media) => media.title && media.title.startsWith(partialTitle),
    // );
    const media = allMedia
      .filter((media) => media.title && media.title.startsWith(partialTitle))
      .map(({ users, ...media }) => media);

    if (!allMedia.length) {
      if (platformId > 0 && platformId < 4) {
        const tmbd = await this.movieBDD.searchMovie(partialTitle);
        return { source: 'tmbd', data: tmbd };
      } else {
        const giantbombData = await this.giantBomb.searchGame(partialTitle);
        // Traitez les données reçues si nécessaire
        return { source: 'giantbomb', data: giantbombData };
      }
    }
    return { source: 'local', data: media };
  }
  async getAllMediaByPlatformAndUser(platformId: number, userId: number) {
    const allMedia = await this.mediaRepository.find({
      relations: ['platforms', 'users'],
      where: {
        platforms: {
          id: platformId,
        },
        users: {
          id: userId,
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
    return allMedia.map(({ users, ...rest }) => rest);
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

  async removeRelationUserMedia(userId: number, mediaId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['medias'],
    });
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!user) {
      throw new NotFoundException(
        `Impossible de trouver l'utilisateur avec l'ID ${userId}`,
      );
    }
    if (!media) {
      throw new NotFoundException(
        `Nous ne parvenons pas à trouver le titre que vous essayez de supprimé`,
      );
    }
    console.log(user);
    console.log(user.medias);

    user.medias = user.medias.filter((media) => +media.id !== +mediaId);

    console.log('apres filter ' + JSON.stringify(user.medias));

    // Sauvegardez l'utilisateur, ce qui mettra à jour la table de jointure user_media.
    await this.userRepository.save(user);

    console.log(user);

    return {
      message: `${user.username} ne possede plus le titre ${media.title}`,
    };
  }
}
