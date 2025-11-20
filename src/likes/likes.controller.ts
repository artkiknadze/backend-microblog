import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiHeader, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthGuard)
  @Post(':postId')
  @ApiOperation({ summary: 'Поставити лайк на пост' })
  @ApiHeader({ name: 'Authorization' })
  @ApiParam({ name: 'postId', description: 'ID поста' })
  create(@Param('postId') postId: string, @Req() req) {
    return this.likesService.create(+postId, +req.user.sub);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Отримати лайки, які поставив користувач' })
  @ApiParam({ name: 'userId', description: 'ID користувача' })
  findOne(@Param('userId') userId: string) {
    return this.likesService.findAll(+userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':postId')
  @ApiParam({ name: 'postId', description: 'ID поста' })
  @ApiHeader({ name: 'Authorization' })
  @ApiOperation({ summary: 'Видалити лайк з поста' })
  remove(@Param('postId') postId: string, @Req() req) {
    return this.likesService.remove(+postId, +req.user.sub);
  }
}
