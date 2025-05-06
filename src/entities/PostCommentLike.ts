import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Unique,
} from 'typeorm';
import { User } from './User';
import { PostComment } from './PostComment';

@Entity()
@Unique(['user', 'comment'])
export class PostCommentLike {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.likedPostComments, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => PostComment, (comment) => comment.likes, { onDelete: 'CASCADE' })
    comment!: PostComment;
}