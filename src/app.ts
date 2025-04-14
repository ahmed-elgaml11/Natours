import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({path: path.join(__dirname, '../config.env')})
import { AppError } from './utils/appError'; 
import firstResponse from './types/firstResponse';
import api from './api'
import errorHandler from './middlewares/errorHandler';



const app = express();
app.use(express.json());


app.get<{}, firstResponse>('/', (req, res) => {
    res.json({
        message: 'hello from the root'
    })
})



app.use('/api/v1', api)

app.all('*', (req, res, next) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404))
})
app.use(errorHandler)

export default app;