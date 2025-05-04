import { 
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Unique
} from "typeorm";
import { User } from "./User";

@Entity()
@Unique(['follower', 'following'])
export class Follower {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
    follower!: User;

    @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
    following!: User;

    @CreateDateColumn()
    createdAt!: Date;
}