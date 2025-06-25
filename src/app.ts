import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../config.env') })
import { AppError } from './utils/appError';
import firstResponse from './types/firstResponse';
import api from './api'
import errorHandler from './middlewares/errorHandler';
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoSantize from 'express-mongo-sanitize'
import hpp from 'hpp'
import { cloCon } from './utils/cloudinary'
import { swaggerSpec } from './utils/swagger';
import swaggerUi from 'swagger-ui-express';
import cros from 'cors'
import cookieParser from 'cookie-parser';




const app = express();

app.use(cookieParser()); 

cloCon()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cros({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))

// set security headers
app.use(helmet());
// limit body payload to prevent 'denial of service attack'
app.use(express.json({ limit: '20kb' }));
// limit the number of request for the same ip per window
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'too many requests from this IP, try again in 15 minutes'
})
app.use('/api', limiter)
// data sanitization against query injection
app.use(mongoSantize())
// request logger 
app.use(morgan('dev'))

// prevent parameter pollution
app.use(hpp({
    whitelist: [
        'price',
        'difficulty',
        'duration',
        'maxGroupSize'
    ]
}))
app.set('view engine', 'ejs');
app.set('views', 'views')


app.get<{}, firstResponse>('/', (req, res) => {
    res.status(200).json({
        message: 'Hello from the root'
    })
})

app.use('/api/v1', api)

app.all('*', (req, res, next) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404))
})

app.use(errorHandler)

export default app;





