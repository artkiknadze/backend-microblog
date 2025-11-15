import { Injectable } from '@nestjs/common';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FollowsService {
  constructor(@InjectRepository(Follow) private followsRepository: Repository<Follow>) { }

  async create(followedId: number, userId: number) {
    const follow = this.followsRepository.create({ user: { id: userId }, followed: { id: followedId } });
    await this.followsRepository.save(follow);
    return follow;
  }

  async findFollows(userId: number) {
    const follows = await this.followsRepository.find({
      where: { user: { id: userId } },
      relations: ['followed'],
    });
    return follows;
  }

  async findFollowers(userId: number) {
    const followers = await this.followsRepository.find({
      where: { followed: { id: userId } },
      relations: ['user'],
    });
    return followers;
  }

  async remove(followedId: number, userId: number) {
    const follow = await this.followsRepository.findOne({
      where: { followed: { id: followedId }, user: { id: userId } },
    });
    if (!follow) {
      throw new Error('You are not following this user');
    }
    await this.followsRepository.delete({ followed: { id: followedId }, user: { id: userId } });
    return { message: 'Unfollowed successfully' };
  }
}
