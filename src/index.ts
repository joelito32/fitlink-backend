import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import followerRoutes from './routes/followerRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import routineRoutes from './routes/routineRoutes';
import savedRoutineRoutes from './routes/savedRoutineRoutes';
import trainingLogRoutes from './routes/trainingLogRoutes';
import statisticsRoutes from './routes/statisticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', followerRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api', savedRoutineRoutes);
app.use('/api/trainingLogs', trainingLogRoutes);
app.use('/api/statistics', statisticsRoutes);

app.get('/', (__req, res) => {
    res.send('✅ API de FitLink funcionando');
});

AppDataSource.initialize()
    .then(() => {
        console.log('📦 Base de datos conectada');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar a la base de datos', err);
    });