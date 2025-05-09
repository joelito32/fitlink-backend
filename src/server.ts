import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from './data-source';
import routes from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api', routes);

app.get('/', (_req, res) => {
    res.send('✅ API de FitLink funcionando');
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error no controlado:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
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