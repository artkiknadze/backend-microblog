import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(@InjectRepository(Like) private readonly likeRepository: Repository<Like>) { }

  async create(postId: number, userId: number) {
    const like = this.likeRepository.create({ post: { id: postId }, user: { id: userId } });
    await this.likeRepository.save(like);
    return { message: 'Like added' };
  }

  async findAll(userId: number) {
    return await this.likeRepository.find({ where: { user: { id: userId } }, relations: ['post'] });
  }

  async remove(postId: number, userId: number) {
    const like = await this.likeRepository.findOne({ where: { post: { id: postId }, user: { id: userId } } });
    if (!like) {
      throw new BadRequestException('Like not found');
    }
    await this.likeRepository.remove(like);
    return { message: 'Like removed' };
  }
}
