import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { ExerciseLog } from './entities/ExerciseLog';
import { ExercisePerformance } from './entities/ExercisePerformance';
import { Follower } from './entities/Follower';
import { Mention } from './entities/Mention';
import { Notification } from './entities/Notification';
import { Post } from './entities/Post';
import { PostComment } from './entities/PostComment';
import { PostCommentLike } from './entities/PostCommentLike';
import { PostLike } from './entities/PostLike';
import { PostSaved } from './entities/PostSaved';
import { Routine } from './entities/Routine';
import { SavedRoutine } from './entities/SavedRoutine';
import { TrainingLog } from './entities/TrainingLog';
import { User } from './entities/User';
import { WeightLog } from './entities/WeightLog';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        ExerciseLog, 
        ExercisePerformance, 
        Follower, 
        Mention, 
        Notification, 
        Post, 
        PostComment, 
        PostCommentLike, 
        PostLike, 
        PostSaved, 
        Routine, 
        SavedRoutine, 
        TrainingLog, 
        User, 
        WeightLog],
    migrations: [],
    subscribers: [],
});