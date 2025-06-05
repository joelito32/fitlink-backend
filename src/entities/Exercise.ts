// src/entities/Exercise.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Exercise {
    @PrimaryColumn()
    id!: string;

    @Column()
    name!: string;

    @Column()
    bodyPart!: string;

    @Column()
    equipment!: string;

    @Column()
    target!: string;

    @Column()
    gifUrl!: string;

    @Column("text", { array: true })
    secondaryMuscles!: string[];

    @Column("text")
    instructions!: string;
}
