import { 
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
} from "typeorm";
import { TrainingLog } from "./TrainingLog";

@Entity()
export class ExercisePerformance {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => TrainingLog, (log) => log.performances, { onDelete: 'CASCADE' })
    trainingLog!: TrainingLog;

    @Column()
    exerciseId!: string;

    @Column()
    name!: string;

    @Column('simple-array')
    reps!: number[];

    @Column('simple-array')
    weights!: number[];

    @Column({ default: false })
    isBodyweight!: boolean;
}