import { Request, Response } from "express";
import {
    searchUsers,
    searchPosts,
    searchPublicRoutines,
} from "../services/searchService";

export const search = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, type } = req.query;

        if (!q || typeof q !== 'string') {
            res.status(400).json({ message: 'Falta el parámetro de búsqueda' });
            return;
        }

        const results: Record<string, any> = {};

        if (!type || type === 'user') {
            results.users = await searchUsers(q);
        }

        if (!type || type === 'post') {
            results.posts = await searchPosts(q);
        }

        if (!type || type === 'routine') {
            results.routines = await searchPublicRoutines(q);
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
