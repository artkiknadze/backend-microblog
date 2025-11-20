import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';
import { EmailConsumer } from './email.processor';

@Module({
  imports: [
    UsersModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD
      }
    }),
    BullModule.registerQueue({
      name: 'daily-posts',
    })
  ],
  providers: [EmailService, EmailConsumer]
})
export class EmailModule { }
