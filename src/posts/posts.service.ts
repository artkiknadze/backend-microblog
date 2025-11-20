import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) { }

  async create(createPostDto: CreatePostDto, userId: number) {
    if (createPostDto.replyToPostId) {
      const parentPost = await this.postRepository.findOne({ where: { id: createPostDto.replyToPostId } });
      if (!parentPost) {
        throw new BadRequestException(`Post with id ${createPostDto.replyToPostId} not found`);
      }
    }

    if (!createPostDto.body) {
      throw new BadRequestException('Post body cannot be empty');
    }

    const post = this.postRepository.create({
      ...createPostDto,
      user: { id: userId },
      replyToPost: createPostDto.replyToPostId ? { id: createPostDto.replyToPostId } : undefined,
    });
    await this.postRepository.save(post);

    return post;
  }

  async findByUser(userId: number) {
    return this.postRepository.find({ where: { user: { id: userId } }, relations: ['user', 'replyToPost'] });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user', 'replyToPost'] });
    if (!post) {
      throw new BadRequestException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: number, userId: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({ where: { id, user: { id: userId } } });
    if (!post) {
      throw new BadRequestException(`Post not found`);
    }

    post.body = updatePostDto.body ?? post.body;
    await this.postRepository.save(post);

    return post;
  }

  async remove(id: number, userId: number) {
    const post = await this.postRepository.findOne({ where: { id, user: { id: userId } } });
    if (!post) {
      throw new BadRequestException(`Post not found`);
    }

    await this.postRepository.remove(post);
    return { message: `Post with id ${id} has been removed` };
  }
}
