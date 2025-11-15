import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(AuthGuard)
  @Post(':userId')
  @ApiOperation({ summary: 'Підписатися на користувача' })
  create(@Param('userId') userId: string, @Req() req) {
    return this.followsService.create(+userId, +req.user.sub);
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

  @UseGuards(AuthGuard)
  @Delete(':userId')
  @ApiOperation({ summary: 'Відписатися від користувача' })
  remove(@Param('userId') id: string) {
    return this.followsService.remove(+id);
  }
}
