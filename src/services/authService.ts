import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { isValidEmail, isValidPassword, isValidUsername } from "../utils/validateInput";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

interface RegisterData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface LoginData {
    identifier: string;
    password: string;
}

export const registerUser = async ({
    email,
    username,
    password,
    confirmPassword,
}: RegisterData): Promise<{ success: boolean; message: string}> => {
    const userRepo = AppDataSource.getRepository(User);

    if (!email || !username || !password || !confirmPassword) {
        return { success: false, message: 'Todos los campos son obligatorios' };
    }

    if (!isValidEmail(email)) {
        return { success: false, message: 'Email no válido' };
    }

    if (!isValidUsername(username)) {
        return { success: false, message: 'Nombre de usuario no válido' };
    }

    if (username.length > 20) {
        return { success: false, message: 'El nombre de usuario no puede tener más de 20 carácteres.'};
    }

    if (!isValidPassword(password)) {
        return {
            success: false,
            message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
        };
    }

    if (password !== confirmPassword) {
        return { success: false, message: 'Las contraseñas no coinciden' };
    }

    const existingEmail = await userRepo.findOne({ where: { email } });
    if (existingEmail) {
        return { success: false, message: 'El email ya está registrado' };
    }

    const existingUsername = await userRepo.findOne({ where: { username } });
    if (existingUsername) {
        return { success: false, message: 'El nombre de usuario ya está en uso' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepo.create({
        email,
        username,
        password: hashedPassword,
    });

    await userRepo.save(newUser);

    return { success: true, message: 'Usuario creado correctamente' };
};

export const loginUser = async ({
    identifier,
    password,
}: LoginData): Promise<{ success: boolean; message: string; token?: string }> => {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo
        .createQueryBuilder('user')
        .where('user.email = :identifier OR user.username = :identifier', { identifier })
        .getOne();

    if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { success: false, message: 'Contraseña incorrecta' };
    }

    const token = generateToken(user.id);

    return { success: true, message: 'Inicio de sesión exitoso', token };
};