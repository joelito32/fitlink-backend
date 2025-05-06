import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Routine } from "./Routine";
import { PostComment } from "./PostComment";
import { PostLike } from "./PostLike";
import { PostSaved } from "./PostSaved";
import { Mention } from "./Mention";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author!: User;

    @ManyToOne(() => Routine, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    routine?: Routine;

    @OneToMany(() => PostComment, (comment) => comment.post)
    comments!: PostComment[];

    @OneToMany(() => PostLike, (like) => like.post)
    likes!: PostLike[];

    @OneToMany(() => PostSaved, (saved) => saved.post)
    savedBy!: PostSaved[];

    @OneToMany(() => Mention, (mention) => mention.sourcePost)
    mentions!: Mention[];
}