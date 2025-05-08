import { AppDataSource } from "../data-source";
import { Routine } from "../entities/Routine";
import { SavedRoutine } from "../entities/SavedRoutine";
import { createNotification } from "./notificationService";

export const findRoutineWithOwner = async (routineId: number): Promise<Routine | null> => {
    return await AppDataSource.getRepository(Routine).findOne({
        where: { id: routineId },
        relations: ['owner'],
    });
};

export const hasUserSavedRoutine = async (userId: number, routineId: number): Promise<boolean> => {
    const existing = await AppDataSource.getRepository(SavedRoutine).findOne({
        where: { user: { id: userId }, routine: { id: routineId } },
    });
    return !!existing;
};

export const saveRoutineForUser = async (userId: number, routine: Routine): Promise<SavedRoutine> => {
    const repo = AppDataSource.getRepository(SavedRoutine);
    const saved = repo.create({ user: { id: userId }, routine });
    await repo.save(saved);
    if (routine.owner.id !== userId) {
        await createNotification(routine.owner.id, userId, 'ha guardado tu rutina');
    }
    return saved;
};

export const removeSavedRoutineForUser = async (userId: number, routineId: number): Promise<boolean> => {
    const repo = AppDataSource.getRepository(SavedRoutine);
    const existing = await repo.findOne({
        where: { user: { id: userId }, routine: { id: routineId } },
    });
    if (!existing) return false;
    await repo.remove(existing);
    return true;
};

export const getSavedRoutinesForUser = async (userId: number): Promise<Routine[]> => {
    const saved = await AppDataSource.getRepository(SavedRoutine).find({
        where: { user: { id: userId } },
        relations: ['routine', 'routine.owner'],
        order: { id: 'DESC' },
    });
    return saved.map(s => s.routine);
};