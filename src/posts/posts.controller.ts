import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, Inject } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, @Inject(CACHE_MANAGER) private cache: Cache) { }

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Створити новий пост' })
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postsService.create(createPostDto, req.user.sub);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Отримати пости користувача' })
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати пост за ID' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити пост за ID' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req) {
    return this.postsService.update(+id, req.user.sub, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити пост за ID' })
  remove(@Param('id') id: string, @Req() req) {
    return this.postsService.remove(+id, req.user.sub);
  }
}
