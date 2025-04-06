import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({path: path.join(__dirname, '../config.env')})


import firstResponse from './interfaces/firstResponse';
import api from './api'
import notFound from './middlewares/notFound';
import errorHandler from './middlewares/errorHandler';



const app = express();
app.use(express.json());


app.get<{}, firstResponse>('/', (req, res) => {
    res.json({
        message: 'hello from the root'
    })
})



app.use('/api/v1', api)

app.use(notFound)
app.use(errorHandler)

export default app;