import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from '../posts/entities/post.entity';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (!(await this.isUsernameUnique(createUserDto.username))) {
      return new BadRequestException('Username is already taken');
    }
    if (!(await this.isEmailUnique(createUserDto.email))) {
      return new BadRequestException('Email is already taken');
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return { id: user.id, username: user.username, email: user.email };
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ? false : true;
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? false : true;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  async findAll() {
    return await this.userRepository.find({
      select: { id: true, displayName: true, email: true },
    });
  }

  async makeFeed(userId: number) {
    const posts: Post[] = [];
    const feed = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        followed: {
          followed: {
            posts: true,
          },
        },
      },
    });
    feed?.followed.forEach((author) => {
      const authorPosts =
        author.followed?.posts?.filter(
          (post) =>
            new Date(post.createdAt) >=
            new Date(Date.now() - 24 * 60 * 60 * 1000),
        ) ?? [];
      authorPosts.map((post, i) => (authorPosts[i].user = author.followed));
      posts.push(...authorPosts);
    });
    return posts;
  }

  async findByEmail(email: string, selectPassword = false) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: selectPassword
        ? ['id', 'username', 'email', 'password']
        : ['id', 'username', 'email'],
    });
    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto) {
      return new BadRequestException('Update data is empty');
    }
    if (
      updateUserDto.username &&
      !(await this.isUsernameUnique(updateUserDto.username))
    ) {
      return new BadRequestException('Username is already taken');
    }
    if (
      updateUserDto.email &&
      !(await this.isEmailUnique(updateUserDto.email))
    ) {
      return new BadRequestException('Email is already taken');
    }

    await this.userRepository.update(id, updateUserDto);
    return updateUserDto;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      return new BadRequestException(`User with id ${id} not found`);
    }
    return { message: `User with id ${id} has been deleted` };
  }
}
