import { Strategy, ExtractJwt } from "passport-jwt";
import type { StrategyOptions } from "passport-jwt";
import { prisma } from "./db";

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'mi_clave_super_secreta'
};

export const JWTStrategy = new Strategy(options, async (payload, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, role: true }
        });
        if (user) return done(null, user); //validado
        return done(null, false); //fallo
    } catch (error) {
        return done(null, payload);
    }
});
