import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { Follower } from "./Follower";
import { Routine } from "./Routine";
import { SavedRoutine } from "./SavedRoutine";
import { TrainingLog } from "./TrainingLog";
import { WeightLog } from "./WeightLog";
import { Post } from "./Post";
import { PostComment } from "./PostComment";
import { PostLike } from "./PostLike";
import { PostSaved } from "./PostSaved";
import { PostCommentLike } from "./PostCommentLike";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true})
    email!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    username!: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ type: 'date', nullable: true })
    birthdate?: Date;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column({ nullable: true })
    profilePic?: string;

    @Column({ type: 'float', nullable: true })
    weight?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Follower, (f) => f.follower)
    following!: Follower[];

    @OneToMany(() => Follower, (f) => f.following)
    followers!: Follower[];

    @OneToMany(() => Routine, (routine) => routine.owner)
    routines!: Routine[];

    @OneToMany(() => SavedRoutine, (saved) => saved.user)
    savedRoutines!: SavedRoutine[];

    @OneToMany(() => TrainingLog, (log) => log.user)
    trainingLogs!: TrainingLog[];

    @OneToMany(() => WeightLog, (log) => log.user)
    weightLogs!: WeightLog[];

    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

    @OneToMany(() => PostComment, (comment) => comment.author)
    postComments!: PostComment[];

    @OneToMany(() => PostLike, (like) => like.user)
    postLikes!: PostLike[];

    @OneToMany(() => PostSaved, (saved) => saved.user)
    savedPosts!: PostSaved[];

    @OneToMany(() => PostCommentLike, (like) => like.user)
    likedPostComments!: PostCommentLike[];
}