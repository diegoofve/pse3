import bcrypt from "bcryptjs";
import type { GenericResponseDto } from "../dto/common.dto";
import { prisma } from "../lib/db";
import { Role } from "@prisma/client";
import type { RegisterResponseDto } from "../dto/auth.dto";
import jwt from "jsonwebtoken";

/**
 * Lógica de negocio para autenticación
 */
export const AuthService = {
    // Registro de usuarios
    register: async (email: string, password: string, role?: Role): Promise<RegisterResponseDto> => {
        const hashedPassword: string = await bcrypt.hash(password, 10);
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: Role.CLIENT,
                },
                select: { id: true, email: true, role: true },
            });
            return { success: true, user };
        } catch (error: any) {
            return {
                success: false,
                error: 'Error interno al registrar el usuario.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    },

    // Inicio de sesión
    login: async (email: string, password: string): Promise<GenericResponseDto> => {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return { success: false, error: 'Usuario no encontrado' };
            }

            const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { success: false, error: 'Contraseña inválida' };
            }

            const token: string = jwt.sign(
                { sub: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'mi_clave_super_secreta',
                { expiresIn: '8h' }
            );

            return { success: true, token };
        } catch (error: any) {
            return {
                success: false,
                error: 'Error interno al iniciar sesión.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }
}