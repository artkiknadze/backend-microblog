import { Follow } from "src/follows/entities/follow.entity";
import { Like } from "src/likes/entities/like.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    displayName: string;

    @Column({ unique: true, select: false })
    email: string;

    @Column({ select: false })
    password: string;

    @OneToMany(() => Like, like => like.user)
    likes: Like[];

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @OneToMany(() => Follow, follow => follow.followed)
    followed: Follow[];
}
