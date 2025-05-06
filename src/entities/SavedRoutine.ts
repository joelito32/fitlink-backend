import { 
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Unique,
} from "typeorm";
import { User } from "./User";
import { Routine } from "./Routine";

@Entity()
@Unique(['user', 'routine'])
export class SavedRoutine {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.savedRoutines, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Routine, (routine) => routine.savedBy, { onDelete: 'CASCADE' })
    routine!: Routine;
}