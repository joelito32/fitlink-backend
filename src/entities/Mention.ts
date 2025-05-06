import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';
import { PostComment } from './PostComment';

@Entity()
export class Mention {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    mentionedUser!: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    createdBy!: User;

    @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
    sourcePost?: Post;

    @ManyToOne(() => PostComment, { nullable: true, onDelete: 'CASCADE' })
    sourceComment?: PostComment;

    @Column()
    type!: 'post' | 'comment';

    @CreateDateColumn()
    createdAt!: Date;
}