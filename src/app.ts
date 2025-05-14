import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../config.env') })
import { AppError } from './utils/appError';
import firstResponse from './types/firstResponse';
import api from './api'
import errorHandler from './middlewares/errorHandler';
import { rateLimit } from 'express-rate-limit'


const app = express();
app.use(express.json());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'too many requests from this IP, try again in 15 minutes'
})

app.use('/api', limiter)

app.get<{}, firstResponse>('/', (req, res) => {
    res.status(200).json({
        message: 'hello from the root'
    })
})



app.use('/api/v1', api)

app.all('*', (req, res, next) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404))
})
app.use(errorHandler)

export default app;