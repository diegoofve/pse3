import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'cinesAPI',
            version: '1.0.0',
            description: 'API de la practica de cines de PSE'
        },
        servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
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
    apis: ['./src/controllers/*.ts', './src/dto/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);