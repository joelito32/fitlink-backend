import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Unique,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
@Unique(['user', 'post'])
export class PostSaved {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.savedPosts, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Post, (post) => post.savedBy, { onDelete: 'CASCADE' })
    post!: Post;
}