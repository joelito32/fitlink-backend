import { 
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    Column,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    recipient!: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    sender!: User;

    @Column()
    message!: string;

    @Column({ default: false })
    read!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}