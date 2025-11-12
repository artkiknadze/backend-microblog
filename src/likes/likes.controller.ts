import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @Post(':postId')
  @ApiOperation({ summary: 'Поставити лайк на пост' })
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Отримати лайки, які поставив користувач' })
  findOne(@Param('userId') userId: string) {
    return this.likesService.findOne(+userId);
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Видалити лайк з поста' })
  remove(@Param('postId') postId: string) {
    return this.likesService.remove(+postId);
  }
}
