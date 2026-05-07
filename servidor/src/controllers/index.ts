import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import protectedRouter from '../middlewares/protectedRouter';
import publicRouter from '../middlewares/publicRouter';
import passport from 'passport';
import { JWTStrategy } from '../lib/auth';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../../apiconfig';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

passport.use('jwt', JWTStrategy);
app.use(passport.initialize());
app.use(publicRouter);
app.use(protectedRouter);
app.use('/api', protectedRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})
