import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { User } from './User';
import { Post } from './Post';
import { PostCommentLike } from './PostCommentLike';
import { Mention } from './Mention';

@Entity()
export class PostComment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.postComments, { onDelete: 'CASCADE' })
    author!: User;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post!: Post;

    @ManyToOne(() => PostComment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    parent?: PostComment;

    @OneToMany(() => PostComment, (comment) => comment.parent)
    replies!: PostComment[];

    @OneToMany(() => PostCommentLike, (like) => like.comment)
    likes!: PostCommentLike[];

    @OneToMany(() => Mention, (mention) => mention.sourceComment)
    mentions!: Mention[];
}