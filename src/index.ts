import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

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