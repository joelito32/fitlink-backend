import { Request, Response } from 'express';
import { obtenerEjercicios } from '../services/ejerciciosService';

export const getEjercicios = (req: Request, res: Response): void => {
    try {
        const { bodyPart, target } = req.query;
        const ejercicios = obtenerEjercicios({
            bodyPart: bodyPart?.toString(),
            target: target?.toString(),
        });
        res.status(200).json(ejercicios);
    } catch (error) {
        console.error('Error al obtener ejercicios:', error);
        res.status(500).json({ message: 'Error al cargar los ejercicios' });
    }
};
