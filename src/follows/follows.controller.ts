import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Підписатися на користувача' })
  create(@Body() createFollowDto: CreateFollowDto) {
    return this.followsService.create(createFollowDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Отримати підписки користувача' })
  findFollows(@Param('userId') userId: string) {
    return this.followsService.findFollows(+userId);
  }

  @Get('followers/:userId')
  @ApiOperation({ summary: 'Отримати підписників користувача' })
  findFollowers(@Param('userId') userId: string) {
    return this.followsService.findFollowers(+userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Відписатися від користувача' })
  remove(@Param('userId') id: string) {
    return this.followsService.remove(+id);
  }
}
