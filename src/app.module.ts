import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowsModule } from './follows/follows.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FollowsModule, UsersModule, PostsModule, LikesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
