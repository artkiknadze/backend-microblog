import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { Transporter, createTransport } from "nodemailer";

@Processor('daily-posts')
export class EmailConsumer extends WorkerHost {
    private transporter: Transporter;
    constructor(private readonly usersService: UsersService) {
        super();
        this.transporter = createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT || '2525'),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const user = job.data.user as User;
        const posts = await this.usersService.makeFeed(user.id);

        await this.transporter.sendMail({
            from: 'noreply@micro.blog',
            to: user.email,
            subject: 'Daily mail!',
            html: `Hey, ${user.displayName}!<br><br>
            
            ${posts.length > 0 
                ? posts.map(post => `${post.user.displayName} created a new post: <br><b>${post.body}</b><br><br>`).join('') 
                : 'You have no news today ;('
            }
            `
        })
    }
}