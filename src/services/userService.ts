import { AppDataSource } from "../data-source"
import { User } from "../entities/User"

interface ProfileData {
    name?: string;
    birthdate?: Date;
    bio?: string;
    profilePic?: string;
}

const DEFAULT_PROFILE_PIC = 
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export const updateUserProfile = async (
    userId: number,
    { name, birthdate, bio, profilePic }: ProfileData
): Promise<{ success: boolean; message: string }> => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    if (name && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
        return { success: false, message: 'Nombre inválido' };
    }

    if (bio && bio.length > 100) {
        return { success: false, message: 'La biografía no puede tener más de 100 caracteres' };
    }

    if (birthdate) {
        const birth = new Date(birthdate);
        const now = new Date();

        const age = now.getFullYear() - birth.getFullYear();

        if (age < 13) {
            return {success: false, message: 'Debes tener al menos 13 años para usar FitLink' };
        }

        user.birthdate = birth
    }

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.profilePic = profilePic || DEFAULT_PROFILE_PIC;

    await userRepo.save(user);

    return { success: true, message: 'Perfil actualizado correctamente' };
};