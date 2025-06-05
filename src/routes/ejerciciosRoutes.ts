import { Router } from 'express';
import { getEjercicios } from '../controllers/ejerciciosController';

const router = Router();

router.get('/', getEjercicios);

export default router;
