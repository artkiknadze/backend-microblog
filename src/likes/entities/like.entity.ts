import { Post } from "src/posts/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Post, post => post.id)
    @JoinColumn({ name: 'postId' })
    post: Post;
}
