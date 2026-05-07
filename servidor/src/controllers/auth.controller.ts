import type { Request, Response } from 'express';
import { isValidEmail } from '../lib/utils';
import { AuthService } from '../services/auth.service';
import { Role } from '@prisma/client'

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: "usuario@email.com"
 *         password:
 *           type: string
 *           example: "contraseña123"
 *     LoginDto:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: "usuario@email.com"
 *         password:
 *           type: string
 *           example: "contraseña123"
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     BuyTicketDto:
 *       type: object
 *       required: [movieId, cinemaId, cardHolder, cardNumber, expiryDate, cvv]
 *       properties:
 *         movieId:
 *           type: integer
 *           example: 1
 *         cinemaId:
 *           type: integer
 *           example: 1
 *         cardHolder:
 *           type: string
 *           example: "Samuel Encinas"
 *         cardNumber:
 *           type: string
 *           example: "4111111111111111"
 *         expiryDate:
 *           type: string
 *           example: "12/27"
 *         cvv:
 *           type: string
 *           example: "123"
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: El email ya existe
 */
const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !isValidEmail(email)) {
            res.status(400).json({ error: 'Email no válido' });
        }
        if (!password || password.length < 6) {
            res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const response = await AuthService.register(email, password, Role.CLIENT);
        if (!response.success) {
            res.status(400).json(response);
        } else {
            res.status(201).json(response);
        }
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message ? error.message : JSON.stringify(error) })
    }
}

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión, devuelve JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Credenciales incorrectas
 */
const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const response = await AuthService.login(email, password);
        if (!response.success) {
            res.status(401).json(response);
        } else {
            res.status(200).json(response);
        }
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message ? error.message : JSON.stringify(error) })
    }
}

export const AuthController = {
    register,
    login
}