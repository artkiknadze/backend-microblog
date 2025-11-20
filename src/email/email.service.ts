import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailService {
    constructor(
        @InjectQueue('daily-posts') private readonly dailyPostsQueue: Queue,
        private readonly usersService: UsersService
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // @Cron(CronExpression.EVERY_5_SECONDS)
    async handleCron() {
        const users = await this.usersService.findAll();
        users.forEach(async (user) => {
            await this.dailyPostsQueue.add('daily-posts', { user });
        });
    }
}
