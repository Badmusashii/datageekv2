import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('search/:platformId')
  async searchMedia(
    @Body('title') title: string,
    @Param('platformId') platformId: number,
  ) {
    return this.mediaService.findMediaByTitle(title, platformId);
  }
}
