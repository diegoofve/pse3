import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "CLIENT",
            },
        });
        res.status(201).json({ message: "Usuario creado", id: user.id});
    }catch (e){
        res.status(400).json({ error: "El email ya existe"});
    }
};