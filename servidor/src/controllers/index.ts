import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import protectedRouter from '../middlewares/protectedRouter';
import publicRouter from '../middlewares/publicRouter';
import passport from 'passport';
import { JWTStrategy } from '../lib/auth';

const PORT = 3000;

const app = express();

//JSON
app.use(express.json());
app.use(cors());

passport.use('jwt', JWTStrategy);
app.use(passport.initialize());
app.use(publicRouter);
app.use(protectedRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})
