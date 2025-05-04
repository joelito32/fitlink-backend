import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { Routine } from "./Routine";

@Entity()
export class ExerciseLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Routine, (routine) => routine.exercises, { onDelete: 'CASCADE' })
    routine!: Routine;

    @Column()
    exerciseId!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    sets?: number;

    @Column({ nullable: true })
    reps?: string;
}