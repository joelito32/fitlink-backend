import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
}

export interface AuthRequest extends Request {
    userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};