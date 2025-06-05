import fs from 'fs';
import path from 'path';

interface FiltroEjercicios {
    bodyPart?: string;
    target?: string;
}

export const obtenerEjercicios = (filtros: FiltroEjercicios = {}) => {
    const ruta = path.resolve('data/ejercicios_traducidos.json');
    const ejercicios = JSON.parse(fs.readFileSync(ruta, 'utf-8'));

    const { bodyPart, target } = filtros;

    let resultado = ejercicios;

    if (bodyPart) {
        resultado = resultado.filter(e =>
            e.bodyPart.toLowerCase() === bodyPart.toLowerCase()
        );
    }

    if (target) {
        resultado = resultado.filter(e =>
            e.target.toLowerCase() === target.toLowerCase()
        );
    }

    return resultado;
};
