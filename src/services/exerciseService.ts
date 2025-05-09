import axios from 'axios';

const BASE_URL = 'https://exercisedb.p.rapidapi.com/exercises?limit=10&offset=0';
const API_KEY = process.env.EXERCISEDB_API_KEY || '';
const API_HOST = 'exercisedb.p.rapidapi.com';

export const fetchAllExercises = async () => {
    const response = await axios.get(BASE_URL, {
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
        },
    });

    return response.data;
};

export const getExerciseById = async (id: string) => {
    const all = await fetchAllExercises();
    return all.find((e: any) => e.id === id) || null;
};

export const filterExercisesByTarget = (exercises: any[], target?: string): any[] => {
    if (!target) return exercises;
    return exercises.filter(e => e.target?.toLowerCase() === target.toLowerCase());
};

export const getSortedTargets = (exercises: any[]): string[] => {
    const targetsSet = new Set<string>();
    exercises.forEach(e => {
        if (e.target) {
            targetsSet.add(e.target.toLowerCase());
        }
    });
    return Array.from(targetsSet).sort();
};
