import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/db';
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
        { sub:user.id, role: user.role},
        process.env.JWT_SECRET || 'mi_clase_secretaaa',
        { expiresIn: '8h' }
    );

    res.json({ token });

};