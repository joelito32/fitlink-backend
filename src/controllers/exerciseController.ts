import { Request, Response } from 'express';
import { fetchAllExercises, filterExercisesByTarget, getSortedTargets, searchExercises, fetchExerciseById } from '../services/exerciseService';

export const getAllExercises = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const target = req.query.target?.toString();

        const result = target
            ? await filterExercisesByTarget(target, page)
            : await fetchAllExercises(page);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener ejercicios:', error);
        res.status(500).json({ message: 'Error al obtener ejercicios' });
    }
};

export const getExerciseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const exercise = await fetchExerciseById(id);

        if (!exercise) {
            res.status(404).json({ message: 'Ejercicio no encontrado' });
            return
        }

        res.status(200).json(exercise);
    } catch (error) {
        console.error('Error al obtener ejercicio por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getTargets = async (req: Request, res: Response): Promise<void> => {
    try {
        const targets = await getSortedTargets();
        res.status(200).json(targets);
    } catch (error) {
        console.error('Error al obtener targets:', error);
        res.status(500).json({ message: 'Error al obtener grupos musculares' });
    }
};

export const search = async (req: Request, res: Response): Promise<void> => {
    try {
        const q = req.query.q?.toString();
        const page = parseInt(req.query.page as string) || 1;
        if (!q) {
            res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
            return;
        }
        const results = await searchExercises(q, page);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error en búsqueda de ejercicios:', error);
        res.status(500).json({ message: 'Error al buscar ejercicios' });
    }
};

