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

@Entity()
export class Routine {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => User, (user) => user.routines, { onDelete: 'CASCADE' })
    owner!: User;

    @OneToMany(() => ExerciseLog, (exercise) => exercise.routine, {
        cascade: true,
    })
    exercises!: ExerciseLog[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}