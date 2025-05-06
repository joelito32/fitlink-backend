import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { ExerciseLog } from "./ExerciseLog";
import { SavedRoutine } from "./SavedRoutine";

@Entity()
export class Routine {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    isPublic!: boolean;

    @ManyToOne(() => User, (user) => user.routines, { onDelete: 'CASCADE' })
    owner!: User;

    @OneToMany(() => ExerciseLog, (exercise) => exercise.routine, {
        cascade: true,
    })
    exercises!: ExerciseLog[];

    @OneToMany(() => SavedRoutine, (saved) => saved.routine)
    savedBy!: SavedRoutine[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}