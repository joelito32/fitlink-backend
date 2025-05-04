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
}