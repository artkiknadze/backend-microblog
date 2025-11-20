import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Створити новий пост' })
  @ApiBody({ type: CreatePostDto })
  @ApiHeader({ name: 'Authorization' })
  @ApiResponse({
    status: 401,
    description: 'Користувач не авторизований',
  })
  @ApiResponse({
    status: 201,
    description: 'Пост успішно створений',
  })
  @ApiResponse({
    status: 400,
    description: 'Помилка в body запиту',
  })
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postsService.create(createPostDto, req.user.sub);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Отримати пости користувача' })
  @ApiParam({ name: 'userId', description: 'ID користувача' })
  @ApiResponse({ status: 200, description: 'Пости користувача' })
  @ApiResponse({ status: 400, description: 'Пости не знайдені' })
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати пост за ID' })
  @ApiParam({ name: 'id', description: 'ID користувача' })
  @ApiResponse({ status: 200, description: 'Пост з даним ID' })
  @ApiResponse({ status: 400, description: 'Пост не знайдений' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити пост' })
  @ApiBody({ type: UpdatePostDto })
  @ApiHeader({ name: 'Authorization' })
  @ApiParam({ name: 'id', description: 'ID посту' })
  @ApiResponse({
    status: 401,
    description: 'Користувач не авторизований',
  })
  @ApiResponse({
    status: 201,
    description: 'Пост успішно оновлений',
  })
  @ApiResponse({
    status: 400,
    description: 'Помилка в body запиту або пост не знайдений',
  })
  @ApiOperation({ summary: 'Оновити пост за ID' })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postsService.update(+id, req.user.sub, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити пост за ID' })
  @ApiHeader({ name: 'Authorization' })
  @ApiParam({ name: 'id', description: 'ID посту' })
  @ApiResponse({
    status: 401,
    description: 'Користувач не авторизований',
  })
  @ApiResponse({
    status: 201,
    description: 'Пост успішно оновлений',
  })
  @ApiResponse({
    status: 400,
    description: 'Пост не знайдений',
  })
  remove(@Param('id') id: string, @Req() req) {
    return this.postsService.remove(+id, req.user.sub);
  }
}
