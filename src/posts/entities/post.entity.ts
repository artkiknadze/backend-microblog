import { Like } from "src/likes/entities/like.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Post, post => post.id, { nullable: true })
    @JoinColumn({ name: 'replyToPostId' })
    replyToPost?: Post;

    @OneToMany(() => Post, post => post.replyToPost)
    replies: Post[];

    @OneToMany(() => Like, like => like.post)
    likes: Like[];
}
