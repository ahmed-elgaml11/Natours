import { AnyZodObject, z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

export const validateRequest = (schema : AnyZodObject) => {
    return catchAsync(async(req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if(!result.success){
            const messages = result.error.errors.map(err => {
                const field = err.path.join('.')
                return `${field}: ${err.message}`
            }).join(', ')
            throw new AppError(`Validation Error: ${messages} || Validation Faield` , 400)
        }
        next()
    })
}
