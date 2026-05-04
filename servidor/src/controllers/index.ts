import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import protectedRouter from '../middlewares/protectedRouter';
import publicRouter from '../middlewares/publicRouter';
import passport from 'passport';
import { JWTStrategy } from '../lib/auth';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc, { Options } from 'swagger-jsdoc'; 

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());

const options: swaggerJsdoc.Options = { //esto ns que es xd
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cines API',
            version: '1.0.0',
            description: 'API REST para gestión de películas y cines PSE 2025-2026'
        },
        servers: [{ url: 'http://localhost:3000/api', description: 'Servidor local' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/controllers/*.ts'] 
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

passport.use('jwt', JWTStrategy);
app.use(passport.initialize());
app.use(publicRouter);
app.use(protectedRouter);
app.use('/api', protectedRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})
