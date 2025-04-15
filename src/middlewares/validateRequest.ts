import { AnyZodObject, z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { updateTourSchema } from '../api/tours/tour.schema';

export const validateRequest = (schema: { body: AnyZodObject, params: AnyZodObject }, fields: ('body' | 'params' | 'halfBody')[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let errors: z.ZodIssue[] = [];
        if (fields.includes('body')) {
            const result = schema.body.safeParse(req.body)
            if (!result.success) {
                errors.push(...result.error.errors)
            }
        }
        if (fields.includes('halfBody')) {
            const result = updateTourSchema.safeParse(req.body)
            if (!result.success) {
                errors.push(...result.error.errors)
            }
        }
        if (fields.includes('params')) {
            const result = schema.params.safeParse(req.params)
            if (!result.success) {
                errors.push(...result.error.errors)
            }
        }

        if (errors.length > 0) {
            const messages = errors.map(err => {
                const field = err.path.join('.')
                return `${field}: ${err.message}`
            }).join(',   ')
            throw new AppError(`Validation Error: ${messages || 'Validation Faield'}`, 400)
        }
        next()
    })
}
