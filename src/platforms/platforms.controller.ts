import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.platformsService.findAll();
  }

  @ApiBearerAuth()
  @Get('toggle')
  @UseGuards(AuthGuard('jwt'))
  async fetchUserPlatformStates(@Request() req) {
    const userdgId = req.user.id;
    console.log('ID received in Request:', req.user?.id);
    return await this.platformsService.fetchUserPlatformStates(userdgId);
  }

  @Get(':id/medias')
  @UseGuards(AuthGuard('jwt'))
  async getMediaForPlatform(@Param('id') id: string) {
    return await this.platformsService.findMediaForPlatform(+id);
  }

  @ApiBearerAuth()
  @Post(':platformId/medias')
  @UseGuards(AuthGuard('jwt'))
  addMediaToUserAndPlatform(
    @Request() req,
    @Param('platformId') platformId: number,
    @Body() body: any,
  ) {
    // console.log('Payload recu' + JSON.stringify(mediaData));
    // const userId = req.user.id;
    const mediaData = body;
    const userId = req.user.id;
    // mediaData = mediaData.title;
    console.log(JSON.stringify(req.user, null, 2));
    console.log('Corps de la requête : ', JSON.stringify(body, null, 2));

    console.log('userdg id : ' + userId);
    console.log('platform ID : ' + platformId);
    console.log('le media : ' + mediaData);
    return this.platformsService.addMediaToUserAndPlatform(
      userId,
      platformId,
      mediaData,
    );
  }

  @ApiBearerAuth()
  @Post('assignUserToPlatform')
  @UseGuards(AuthGuard('jwt')) // si vous voulez sécuriser cette route
  async assignUserToPlatform(
    @Request() req,
    @Body() toggleState: { platformStates: { [id: number]: boolean } },
  ) {
    const userdgId = req.user.id;
    // console.log("l'id user est " + userdgId);
    // console.log("le type de l'id est " + typeof userdgId);
    // console.log('les toggles sont' + JSON.stringify(toggleState));
    return this.platformsService.assignUserToPlatform(userdgId, toggleState);
  }
}
