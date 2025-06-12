import swaggerJsdoc from 'swagger-jsdoc';
import  path  from 'path';
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Natours API',
        version: '1.0.0',
        description: 'Comprehensive API documentation for the Natours travel app',
    },
    servers: [
        {
            url: '/api/v1',
            description: 'Main API server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

const apis = [path.join(__dirname, '../../src/docs/**/*.ts')];
console.log('Using API path:', apis);

export const swaggerSpec = swaggerJsdoc({ swaggerDefinition, apis });
