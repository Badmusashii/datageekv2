import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from './entities/platform.entity';
import { In, Repository } from 'typeorm';
import { Media } from 'src/media/entities/media.entity';
import { Userdg } from 'src/userdg/entities/userdg.entity';
import { PLATFORMS } from './platforms.constants';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformsRepository: Repository<Platform>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(Userdg)
    private userRepository: Repository<Userdg>,
  ) {
    this.initializePlatforms();
  }

  async initializePlatforms() {
    const count = await this.platformsRepository.count();
    if (count === 0) {
      this.platformsRepository.save(PLATFORMS);
    }
  }

  findAll() {
    return this.platformsRepository.find();
  }

  findOne(id: number) {
    console.log('ID received in findOne:', id);
    return this.platformsRepository.findOneOrFail({ where: { id } });
  }

  async fetchUserPlatformStates(
    userdgId: number,
  ): Promise<{ [id: number]: boolean }> {
    // const userdg = await this.userRepository.findOne({
    //   where: { id: userdgId },
    //   relations: ['platforms'],
    // });
    const userdg = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.platforms', 'platform')
      .where('user.id = :userId', { userId: userdgId })
      .getOne();

    if (!userdg) {
      throw new NotFoundException(`User with ID ${userdgId} not found`);
    }

    const platformStates: { [id: number]: boolean } = {};

    for (const platform of userdg.platforms) {
      platformStates[platform.id] = true;
    }

    return platformStates;
  }

  async findMediaForPlatform(platformId: number): Promise<Media[]> {
    const platform = await this.platformsRepository.findOne({
      where: { id: platformId },
      relations: ['medias'],
    });

    if (!platform) {
      throw new NotFoundException(`Platform with ID ${platformId} not found`);
    }
    return platform.medias;
  }

  async addMediaToUserAndPlatform(
    userId: number,
    platformId: number,
    mediaData: any,
  ) {
    console.log('mediaData reçu dans le service back' + mediaData.title);

    const platform = await this.platformsRepository.findOneOrFail({
      where: { id: platformId },
    });
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${platformId} not found`);
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Recherche d'un média existant avec le même titre
    const existingMedia = await this.mediaRepository.findOne({
      where: { title: mediaData.title },
      relations: ['platforms', 'users'], // Charger les relations existantes
    });

    // Si le média existe déjà
    if (existingMedia) {
      // Vérifie si la plateforme est déjà associée à ce média
      const alreadyHasPlatform = existingMedia.platforms.some(
        (p) => p.id === platformId,
      );

      // Si la plateforme n'est pas déjà associée, l'ajouter
      if (!alreadyHasPlatform) {
        existingMedia.platforms.push(platform);
      }

      // Ajoutez l'utilisateur si nécessaire (tu peux aussi vérifier avant de l'ajouter)
      existingMedia.users.push(user);

      return await this.mediaRepository.save(existingMedia); // Sauvegardez les modifications
    }

    // Créez un nouveau média
    const newMedia = new Media();
    Object.assign(newMedia, mediaData);
    newMedia.platforms = [platform]; // Initialiser avec la nouvelle plateforme
    newMedia.users = [user]; // Initialiser avec le nouvel utilisateur

    return await this.mediaRepository.save(newMedia); // Sauvegardez le nouveau média
  }

  async assignUserToPlatform(
    userdgId: number,
    // platformId: number,
    toggleState: { platformStates: { [id: number]: boolean } },
  ): Promise<void> {
    console.log('toggle recu dans le service ' + JSON.stringify(toggleState));
    const userdg = await this.userRepository.findOne({
      where: { id: userdgId },
      relations: ['platforms'],
    });
    // const platform = await this.platformsRepository.findOne({
    //   where: { id: platformId },
    // });
    // const platformStates = State.platformStates || {};
    const platformStates = toggleState.platformStates || {};

    const platformIds = Object.keys(platformStates).map((key) => {
      return +key;
    });
    // console.log('les platforms ids cote back sont => ' + platformIds);
    const platforms = await this.platformsRepository.find({
      where: {
        id: In(platformIds),
      },
    });
    if (platforms.length !== platformIds.length) {
      throw new NotFoundException('Utilisateur ou platforme introuvable');
    }
    userdg.platforms = platforms.filter(
      (platform) => platformStates[platform.id],
    );
    // if (toggleState) {
    //   userdg.platforms = [...(userdg.platforms || []), platform];
    // } else {
    //   userdg.platforms = userdg.platforms.filter((p) => p.id !== platform.id);
    // }

    await this.userRepository.save(userdg);
  }

  async savePlatformStates(states: any): Promise<any> {
    // Ici, vous pouvez sauvegarder les états des toggles en base de données
    // ou effectuer toute autre opération nécessaire.
    return this.platformsRepository.save(states); // Exemple
  }
}
