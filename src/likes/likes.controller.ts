import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @UseGuards(AuthGuard)
  @Post(':postId')
  @ApiOperation({ summary: 'Поставити лайк на пост' })
  create(@Param('postId') postId: string, @Req() req) {
    return this.likesService.create(+postId, +req.user.sub);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Отримати лайки, які поставив користувач' })
  findOne(@Param('userId') userId: string) {
    return this.likesService.findAll(+userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':postId')
  @ApiOperation({ summary: 'Видалити лайк з поста' })
  remove(@Param('postId') postId: string, @Req() req) {
    return this.likesService.remove(+postId, +req.user.sub);
  }
}
