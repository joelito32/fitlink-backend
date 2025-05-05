import { 
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    Column,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Routine } from "./Routine";
import { ExercisePerformance } from "./ExercisePerformance";

@Entity()
export class TrainingLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.trainingLogs, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Routine, { onDelete: 'SET NULL', nullable: true })
    routine!: Routine;

    @OneToMany(() => ExercisePerformance, (performance) => performance.trainingLog, {
        cascade: true,
    })
    performances!: ExercisePerformance[];

    @Column({ type: 'timestamp' })
    startedAt!: Date;

    @Column({ type: 'timestamp' })
    endedAt!: Date;

    @Column({ type: 'int' })
    duration!: number;

    @Column({ type: 'float', default: 0 })
    totalWeight!: number;

    @CreateDateColumn()
    createdAt!: Date;
}