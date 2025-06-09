import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
    createRoutineForUser,
    getUserRoutines,
    findRoutineById,
    updateRoutineData,
    deleteRoutineById,
    getPublicRoutinesFromFollowing,
    toggleRoutineVisibility,
    validateAndBuildExercises
} from "../services/routineService";

export const createRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }


        const { title, description, exercises, isPublic } = req.body;

        if (!title || typeof title !== "string" || !Array.isArray(exercises) || exercises.length === 0) {
            res.status(400).json({ message: "Faltan datos requeridos" });
            return;
        }

        if (title.trim().length < 3 || title.trim().length > 50) {
            res.status(400).json({ message: "El título debe tener entre 3 y 50 caracteres" });
            return;
        }

        if (description && description.length > 300) {
            res.status(400).json({ message: "La descripción no puede superar los 300 caracteres" });
            return;
        }

        const validated = await validateAndBuildExercises(exercises);
        if (!validated) {
            res.status(400).json({ message: "Error en los datos de los ejercicios" });
            return;
        }

        const routine = await createRoutineForUser(
            userId, 
            title.trim(), 
            description?.trim(), 
            validated, 
            Boolean(isPublic)
        );
        res.status(201).json({ message: "Rutina creada correctamente", routine });
    } catch (error) {
        console.error("Error al crear rutina:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getRoutines = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }


        const routines = await getUserRoutines(userId);
        res.status(200).json(routines);
    } catch (error) {
        console.error("Error al obtener rutinas:", error);
        res.status(500).json({ message: "Error al obtener rutinas" });
    }
};

export const updateRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.id);
        const { title, description, exercises, isPublic } = req.body;

        if (isNaN(routineId) || !title || typeof title !== "string" || !Array.isArray(exercises)) {
            res.status(400).json({ message: "Datos inválidos" });
            return;
        }

        if (title.trim().length < 3 || title.trim().length > 50) {
            res.status(400).json({ message: "El título debe tener entre 3 y 50 caracteres" });
            return;
        }

        if (description && description.length > 300) {
            res.status(400).json({ message: "La descripción no puede superar los 300 caracteres" });
            return;
        }

        const routine = await findRoutineById(routineId);
        if (!routine || routine.owner.id !== userId) {
            res.status(403).json({ message: "No tienes permiso o rutina no encontrada" });
            return;
        }

        const validated = await validateAndBuildExercises(exercises);
        if (!validated) {
            res.status(400).json({ message: "Error en los datos de los ejercicios" });
            return;
        }

        const updated = await updateRoutineData(routine, title, description, validated, isPublic);
        res.status(200).json({ message: "Rutina actualizada correctamente", routine: updated });
    } catch (error) {
        console.error("Error al actualizar rutina:", error);
        res.status(500).json({ message: "Error al actualizar rutina" });
    }
};

export const deleteRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.id);

        if (isNaN(routineId)) {
            res.status(400).json({ message: "ID de rutina no válido" });
            return;
        }

        const routine = await findRoutineById(routineId);
        if (!routine || routine.owner.id !== userId) {
            res.status(403).json({ message: "No tienes permiso o rutina no encontrada" });
            return;
        }

        await deleteRoutineById(routine);
        res.status(200).json({ message: "Rutina eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar rutina:", error);
        res.status(500).json({ message: "Error al eliminar rutina" });
    }
};

export const getPublicRoutinesFromFollowedUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const routines = await getPublicRoutinesFromFollowing(userId);
        res.status(200).json(routines);
    } catch (error) {
        console.error("Error al obtener rutinas públicas:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

export const setRoutineVisibility = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const routineId = parseInt(req.params.id);
        const { isPublic } = req.body;

        if (isNaN(routineId) || typeof isPublic !== "boolean") {
            res.status(400).json({ message: "Datos inválidos" });
            return;
        }

        const success = await toggleRoutineVisibility(userId, routineId, isPublic);
        if (!success) {
            res.status(403).json({ message: "No tienes permiso o rutina no encontrada" });
            return;
        }

        res.status(200).json({ message: `Rutina marcada como ${isPublic ? "pública" : "privada"}` });
    } catch (error) {
        console.error("Error al cambiar visibilidad de la rutina:", error);
        res.status(500).json({ message: "Error interno" });
    }
};
