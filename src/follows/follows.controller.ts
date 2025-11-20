import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { ApiHeader, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) { }

  @UseGuards(AuthGuard)
  @Post(':userId')
  @ApiOperation({ summary: 'Підписатися на користувача' })
  @ApiHeader({ name: "Authorization" })
  @ApiParam({ name: "userId", description: "ID користувача" })
  create(@Param('userId') userId: string, @Req() req) {
    return this.followsService.create(+userId, +req.user.sub);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Отримати підписки користувача' })
  @ApiParam({ name: "userId", description: "ID користувача" })
  findFollows(@Param('userId') userId: string) {
    return this.followsService.findFollows(+userId);
  }

  @Get('followers/:userId')
  @ApiOperation({ summary: 'Отримати підписників користувача' })
  @ApiParam({ name: "userId", description: "ID користувача" })
  findFollowers(@Param('userId') userId: string) {
    return this.followsService.findFollowers(+userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':userId')
  @ApiHeader({ name: "Authorization" })
  @ApiOperation({ summary: 'Відписатися від користувача' })
  @ApiParam({ name: "userId", description: "ID користувача" })
  remove(@Param('userId') id: string, @Req() req) {
    return this.followsService.remove(+id, +req.user.sub);
  }
}
