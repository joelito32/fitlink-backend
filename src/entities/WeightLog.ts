import {    
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class WeightLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.weightLogs, { onDelete: 'CASCADE' })
    user!: User;

    @Column({ type: 'float' })
    value!: number; // peso en kg

    @CreateDateColumn()
    date!: Date;
}
