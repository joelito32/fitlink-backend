import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./User";
import { ExerciseLog } from "./ExerciseLog";
import { SavedRoutine } from "./SavedRoutine";
import { Exercise } from "./Exercise";

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
    logs!: ExerciseLog[];

    @OneToMany(() => SavedRoutine, (saved) => saved.routine)
    savedBy!: SavedRoutine[];

    @ManyToMany(() => Exercise)
    @JoinTable()
    exercises!: Exercise[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}