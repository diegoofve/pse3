import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { prisma } from '../lib/db';

const options: StrategyOptions =  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'mi_clave_super_secretaaa'
};

export const JWTStrategy = new Strategy(options, async (payload, done) => {
    try{
        const user = await prisma.user.findUnique({
            where: { id: payload.sub }, 
            select: { id: true, username: true, role: true } 
            // Evitar recibir hash (es innecesario)
        });

        if (user) return done(null, user); //valido
        return done(null, false); //fallo

    }catch (error) {
        return done(null, payload);
    }
});