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
