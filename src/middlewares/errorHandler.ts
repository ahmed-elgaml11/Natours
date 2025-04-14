import { Request, Response, NextFunction } from 'express';
import {errorResponse, CustomError } from '../types/errorResponse';
import  mongoose  from 'mongoose';
import { AppError } from '../utils/appError';

const handleCastErrorDb = (err: CustomError) => {
    const message = `invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}
const handleDuplicateFieldsDb = (err: CustomError) => {
    const value = err.errmsg!.match(/(["'])(?:(?=(\\?))\2.)*?\1/)![0];
    const message = `Duplicat field value ${value}, please choose another one`;
    return new AppError(message, 400)
}
const handleValidationErrorDb = (err: CustomError) => {
    const errors = Object.values(err.errors!).map(val => val.message)
    const message = `Invalid input Data: ${errors.join('. ')}`;
    return new AppError(message, 400)

}
const sendErrorDev = (err: CustomError, res: Response<errorResponse>) => {
    res.status(err.statusCode);
    res.json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}
const sendErrorProd = (err: CustomError, res: Response<errorResponse>) => {
    if(err.isOperational){ // trust the error: send the message
        res.status(err.statusCode);
        res.json({
            status: err.status,
            message: err.message,
        });
    }else{    // programming or unknown error: dont tell the client with the error
        console.error(err)
        res.status(500).json({
            status: 'error',
            message: 'something went very wrong'
        })
    }
}
const errorHandler = (err: CustomError, req: Request, res: Response<errorResponse>, next: NextFunction) => {
     err.statusCode = (err.statusCode && err.statusCode !== 200) ? err.statusCode : 500;
     err.status = err.status || 'error'
    if(process.env.NODE_ENV === 'production'){
        let error = { ...err };
        if(error.name == 'CastError')  error = handleCastErrorDb(error)  
        if(error.name == 'ValidationError')  error = handleValidationErrorDb(error)  
        if(error.code == 11000)  error = handleDuplicateFieldsDb(error) 

        sendErrorProd(error, res)
    }else if (process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res)
    }
};

export default errorHandler;
