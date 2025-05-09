import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { WeightLog } from "../entities/WeightLog";

interface ProfileData {
    name?: string;
    birthdate?: Date;
    bio?: string;
    profilePic?: string;
    weight?: number;
}

const DEFAULT_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export const updateUserProfile = async (
    userId: number,
    { name, birthdate, bio, profilePic, weight }: ProfileData
): Promise<{ success: boolean; message: string }> => {
    const userRepo = AppDataSource.getRepository(User);
    const weightLogRepo = AppDataSource.getRepository(WeightLog);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) return { success: false, message: 'Usuario no encontrado' };

    if (name && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
        return { success: false, message: 'Nombre inválido' };
    }

    if (name && name.length > 50) {
        return { success: false, message: 'El nombre no puede tener más de 50 caracteres' };
    }

    if (bio && bio.length > 100) {
        return { success: false, message: 'La biografía no puede tener más de 100 caracteres' };
    }

    if (birthdate) {
        const birth = new Date(birthdate);
        const now = new Date();
        const age = now.getFullYear() - birth.getFullYear();
        if (age < 13) {
            return { success: false, message: 'Debes tener al menos 13 años para usar FitLink' };
        }
        user.birthdate = birth;
    }

    if (weight !== undefined) {
        if (isNaN(weight) || weight <= 0) {
            return { success: false, message: 'El peso debe ser un número válido' };
        }

        if (user.weight !== weight) {
            user.weight = weight;
            const newLog = weightLogRepo.create({ user: { id: userId }, value: weight });
            await weightLogRepo.save(newLog);
        }
    }

    if (profilePic && !/^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)$/.test(profilePic)) {
        return { success: false, message: 'URL de imagen no válida para la foto de perfil' };
    }

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.profilePic = profilePic || DEFAULT_PROFILE_PIC;

    await userRepo.save(user);

    return { success: true, message: 'Perfil actualizado correctamente' };
};

export const findUserById = async (id: number, includeEmail = false): Promise<User | null> => {
    return await AppDataSource.getRepository(User).findOne({
        where: { id },
        select: includeEmail
            ? ['id', 'email', 'username', 'name', 'birthdate', 'bio', 'profilePic', 'createdAt']
            : ['id', 'username', 'name', 'birthdate', 'bio', 'profilePic', 'createdAt'],
    });
};

export const deleteUserById = async (id: number): Promise<boolean> => {
    const result = await AppDataSource.getRepository(User).delete({ id });
    return result.affected !== 0;
};
