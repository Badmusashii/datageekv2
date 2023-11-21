import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { AuthGuard } from '@nestjs/passport';
import { GiantBombService } from 'src/services/giant-bomb/giant-bomb.service';
import { MoviedatabaseService } from 'src/services/moviedatabase/moviedatabase.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private giantBomb: GiantBombService,
    private movieDatabaseService: MoviedatabaseService,
  ) {}

  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Post('search/:platformId')
  @UseGuards(AuthGuard('jwt'))
  async searchMedia(
    @Request() req,
    @Body('title') title: string,
    @Param('platformId') platformId: number,
  ) {
    // Désinfection du champ de recherche
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, '');
    const userId = req.user.id;
    console.log(userId);
    console.log(sanitizedTitle);
    return this.mediaService.findMediaByTitle(
      sanitizedTitle,
      platformId,
      userId,
    );
  }

  @Post('random')
  @UseGuards(AuthGuard('jwt'))
  async getRandomMedia(@Request() req, @Body('type') type: string) {
    const userId = req.user.id; // Assurez-vous que l'utilisateur est authentifié et a un ID utilisateur valide
    try {
      const media = await this.mediaService.getRandomMediaForUser(userId, type);
      if (media) {
        return media;
      } else {
        throw new NotFoundException(
          "Aucun titre trouvé pour l'utilisateur et la plateforme spécifiée.",
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du titre aléatoire.',
      );
    }
  }

  @Get('all/:platformId')
  @UseGuards(AuthGuard('jwt'))
  async getAllMediaByPlatformAndUser(
    @Request() req,
    @Param('platformId') platformId: number,
  ) {
    const userId = req.user.id;
    return this.mediaService.getAllMediaByPlatformAndUser(platformId, userId);
  }
  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }
  @Get('game-info/:guid')
  @UseGuards(AuthGuard('jwt'))
  async getGameInfo(@Param('guid') guid: string) {
    try {
      const gameInfo = await this.giantBomb.searchGameByGuid(guid);
      return gameInfo;
    } catch (error) {
      throw new Error(`Failed to fetch game info: ${error.message}`);
    }
  }

  @Get('game-images/:guid')
  @UseGuards(AuthGuard('jwt'))
  async getAdditionalGameImages(@Param('guid') guid: string) {
    try {
      const images = await this.giantBomb.getAdditionalGameImages(guid);

      return images;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch additional images: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('movie-videos/:movieId')
  @UseGuards(AuthGuard('jwt'))
  async getMovieVideos(@Param('movieId') movieId: number) {
    try {
      const videos = await this.movieDatabaseService.getMovieDetailsWithVideos(
        movieId,
      );
      return videos;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch movie videos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('movie-poster/:movieId')
  @UseGuards(AuthGuard('jwt'))
  async getMoviePoster(@Param('movieId') movieId: number) {
    try {
      const poster = await this.movieDatabaseService.getMoviePoster(movieId);
      console.log(poster, 'controleur back');
      return poster;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch movie poster: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('game-poster/:gameId')
  @UseGuards(AuthGuard('jwt'))
  async getGamePoster(@Param('gameId') gameId: number) {
    try {
      const poster = await this.giantBomb.getGamePoster(gameId);
      console.log(poster, 'controleur back');
      return { posterPath: poster, id: gameId };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch movie poster: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete('deleteTitle/:mediaId')
  @UseGuards(AuthGuard('jwt'))
  remove(@Request() req, @Param('mediaId') mediaId: number) {
    const userId = req.user.id;
    return this.mediaService.removeRelationUserMedia(userId, mediaId);
  }
}
