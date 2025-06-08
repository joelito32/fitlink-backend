import { AppDataSource } from '../data-source';
import { Exercise } from '../entities/Exercise';
import { buildPaginationResponse } from '../utils/pagination';
import { ILike } from 'typeorm';

const exerciseRepository = AppDataSource.getRepository(Exercise);

export const fetchAllExercises = async (page: number): Promise<any> => {
    const take = 10;
    const skip = (page - 1) * take;

    const [data, total] = await exerciseRepository.findAndCount({
        order: { id: 'ASC' },
        skip,
        take,
    });

    return buildPaginationResponse(data, total, page, take);
};

export const fetchExerciseById = async (id: string): Promise<Exercise | null> => {
    return await exerciseRepository.findOneBy({ id });
};

export const getSortedTargets = async (): Promise<string[]> => {
    const allExercises = await exerciseRepository.find(); // sin paginación

    const targetsSet = new Set<string>();
    allExercises.forEach(e => {
        if (e.target) {
            targetsSet.add(e.target.toLowerCase());
        }
    });

    return Array.from(targetsSet).sort();
};


export const searchExercises = async (query: string, page: number): Promise<any> => {
    const take = 10;
    const skip = (page - 1) * take;
    const formattedQuery = `%${query.toLowerCase()}%`;

    const [data, total] = await exerciseRepository
        .createQueryBuilder('exercise')
        .where('LOWER(exercise.name) LIKE :query', { query: formattedQuery })
        .orWhere('LOWER(exercise.bodyPart) LIKE :query', { query: formattedQuery })
        .orWhere('LOWER(exercise.equipment) LIKE :query', { query: formattedQuery })
        .orWhere('LOWER(exercise.target) LIKE :query', { query: formattedQuery })
        .orWhere(`EXISTS (
            SELECT 1 FROM unnest(exercise.secondaryMuscles) AS sm
            WHERE LOWER(sm) LIKE :query
        )`, { query: formattedQuery })
        .orderBy('exercise.id', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

    return buildPaginationResponse(data, total, page, take);
};

export const filterExercisesByTarget = async (target: string, page: number): Promise<any> => {
    const take = 10;
    const skip = (page - 1) * take;

    const [data, total] = await exerciseRepository.findAndCount({
        where: {
            target: ILike(target),
        },
        order: { id: 'ASC' },
        skip,
        take,
    });

    return buildPaginationResponse(data, total, page, take);
};
