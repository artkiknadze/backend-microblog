import { User } from "../../users/entities/user.entity";
import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['user', 'followed'], { unique: true })
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'followedId' })
    followed: User;

}
