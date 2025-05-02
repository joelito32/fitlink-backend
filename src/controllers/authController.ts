import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password, confirmPassword } = req.body;

        const result = await registerUser({ email, username, password, confirmPassword });

        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }

        res.status(201).json({ message: result.message });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }

        const result = await loginUser({ identifier, password });

        if (!result.success) {
            res.status(401).json({ message: result.message });
            return;
        }

        res.status(200).json({ message: result.message, token: result.token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const logout = async (req:Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Sesión cerrada. Elimina le token en el cliente.' })
};