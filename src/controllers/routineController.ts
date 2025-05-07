import { Response } from "express";
import { AppDataSource } from "../data-source";
import { Routine } from "../entities/Routine";
import { ExerciseLog } from "../entities/ExerciseLog";
import { AuthRequest } from "../middlewares/authMiddleware";
import { getExerciseById } from "../services/exerciseService";

export const createRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { title, description, exercises } = req.body;

        if (!title || !Array.isArray(exercises) || exercises.length === 0) {
            res.status(400).json({ message: 'Faltan datos requeridos' });
            return;
        }

        if (title.trim().length < 3 || title.trim().length > 50) {
            res.status(400).json({ message: 'El título debe tener entre 3 y 50 caracteres' });
            return;
        }

        if (description && description.length > 300) {
            res.status(400).json({ message: 'La descripción no puede superar los 300 caracteres' });
            return;
        }

        const validatedExercises: ExerciseLog[] = [];

        for (const e of exercises) {
            const { exerciseId, sets, reps } = e;

            if (!exerciseId || !sets || !reps) {
                res.status(400).json({ message: 'Datos incompletos en algún ejercicio' });
                return;
            }

            if (sets <= 0 || reps <= 0) {
                res.status(400).json({ message: 'Sets y repeticiones deben ser mayores que 0' });
                return;
            }

            const apiExercise = await getExerciseById(exerciseId);
            if (!apiExercise) {
                res.status(400).json({ message: `Ejercicio no encontrado: ${exerciseId}` });
                return;
            }

            const exerciseLog = new ExerciseLog();
            exerciseLog.exerciseId = exerciseId;
            exerciseLog.name = apiExercise.name;
            exerciseLog.sets = sets;
            exerciseLog.reps = reps;

            validatedExercises.push(exerciseLog);
        }

        const routineRepo = AppDataSource.getRepository(Routine);
        const newRoutine = routineRepo.create({
            title,
            description,
            owner: { id: userId },
            exercises: validatedExercises,
        });

        await routineRepo.save(newRoutine);
        res.status(201).json({ message: 'Rutina creada correctamente', routine: newRoutine });
    } catch (error) {
        console.error('Error al crear rutina:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const getRoutines = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const routineRepo = AppDataSource.getRepository(Routine);

        const routines = await routineRepo.find({
            where: { owner: { id: userId } },
            relations: ['exercises'],
            order: { createdAt: 'DESC' },
        });

        res.status(200).json(routines);
    } catch (error) {
        console.error('Error al obtener rutinas:', error);
        res.status(500).json({ message: 'Error al obtener rutinas' });
    }
};

export const updateRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.id);
        const { title, description, exercises } = req.body;
        
        if (isNaN(routineId)) {
            res.status(400).json({ message: 'ID de rutina no válido' });
            return;
        }

        const routineRepo = AppDataSource.getRepository(Routine);
        const routine = await routineRepo.findOne({
            where: { id: routineId },
            relations: ['owner', 'exercises'],
        });

        if (!routine) {
            res.status(404).json({ message: 'Rutina no encontrada' });
            return;
        }

        if (routine.owner.id !== userId) {
            res.status(403).json({ message: 'No tienes permiso para editar esta rutina' });
            return;
        }

        if (!title || typeof title !== 'string' || !Array.isArray(exercises)) {
            res.status(400).json({ message: 'Datos inválidos' });
            return;
        }   

        if (title.trim().length < 3 || title.trim().length > 50) {
            res.status(400).json({ message: 'El título debe tener entre 3 y 50 caracteres' });
            return;
        }

        if (description && description.length > 300) {
            res.status(400).json({ message: 'La descripción no puede superar los 300 caracteres' });
            return;
        }

        const validatedExercises: ExerciseLog[] = [];

        for (const e of exercises) {
            const { exerciseId, sets, reps } = e;

            if (!exerciseId || !sets || !reps) {
                res.status(400).json({ message: 'Datos incompletos en algún ejercicio' });
                return;
            }

            if (!exerciseId || sets <= 0 || reps <= 0) {
                res.status(400).json({ message: 'Sets y repeticiones deben ser mayores que 0' });
                return;
            }

            const apiExercise = await getExerciseById(exerciseId);
            if (!apiExercise || !apiExercise.name) {
                res.status(400).json({ message: `Ejercicio no válido: ${exerciseId}` });
                return;
            }
        
            const exercise = new ExerciseLog();
            exercise.exerciseId = exerciseId;
            exercise.name = apiExercise.name;
            exercise.sets = sets;
            exercise.reps = reps;
        
            validatedExercises.push(exercise);
        }

        routine.title = title.trim();
        routine.description = description?.trim() || '';
        routine.exercises = validatedExercises;

        await routineRepo.save(routine);

        res.status(200).json({ message: 'Rutina actualizada correctamente', routine });
    } catch (error) {
        console.error('Error al actualizar rutina:', error);
        res.status(500).json({ message: 'Error al actualizar rutina' });
    }
};

export const deleteRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.id);

        if (isNaN(routineId)) {
            res.status(400).json({ message: 'ID de rutina no válido' });
            return;
        }

        const routineRepo = AppDataSource.getRepository(Routine);
        const routine = await routineRepo.findOne({
            where: { id: routineId },
            relations: ['owner'],
        });

        if (!routine) {
            res.status(404).json({ message: 'Rutina no encontrada' });
            return;
        }

        if (routine.owner.id !== userId) {
            res.status(403).json({ message: 'No tienes permiso para eliminar esta rutina' });
            return;
        }

        await routineRepo.remove(routine);
        res.status(200).json({ message: 'Rutina eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar rutina:', error);
        res.status(500).json({ message: 'Error al eliminar rutina' });
    }
};

export const getPublicRoutinesFromFollowedUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const raw = await AppDataSource.getRepository(Routine)
            .createQueryBuilder('routine')
            .leftJoinAndSelect('routine.owner', 'owner')
            .where(qb => {
                const sub = qb.subQuery()
                    .select('f.followingId')
                    .from('follower', 'f')
                    .where('f.followerId = :userId')
                    .getQuery();
                return 'routine.ownerId IN ' + sub;
            })
            .andWhere('routine.isPublic = true')
            .setParameter('userId', userId)
            .orderBy('routine.id', 'DESC')
            .getMany();

        res.status(200).json(raw);
    } catch (error) {
        console.error('Error al obtener rutinas públicas:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};