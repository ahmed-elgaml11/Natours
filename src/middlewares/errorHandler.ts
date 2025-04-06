import { Request, Response, NextFunction } from 'express';
import errorResponse from '../interfaces/errorResponse';
const errorHandler = (err: Error, req: Request<errorResponse>, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.ENV === 'production' ? '' : err.stack
    });
};

export default errorHandler;
