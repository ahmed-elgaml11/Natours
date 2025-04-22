import { AnyZodObject, z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { updateTourSchema } from '../api/tours/tour.schema';

export const validateRequest = (
    schema: AnyZodObject | { body: AnyZodObject; params: AnyZodObject },
    fields?: ('body' | 'params' | 'halfBody')[]
) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let errors: z.ZodIssue[] = [];

        if (fields && fields.length > 0) {
            const { body, params } = schema as { body: AnyZodObject; params: AnyZodObject };

            if (fields.includes('body')) {
                const result = body.safeParse(req.body);
                if (!result.success) {
                    errors.push(...result.error.errors);
                }
            }

            if (fields.includes('halfBody')) {
                const result = updateTourSchema.safeParse(req.body);
                if (!result.success) {
                    errors.push(...result.error.errors);
                }
            }

            if (fields.includes('params')) {
                const result = params.safeParse(req.params);
                if (!result.success) {
                    errors.push(...result.error.errors);
                }
            }

            if (errors.length > 0) {
                const messages = errors
                    .map((err) => `${err.path.join('.')}: ${err.message}`)
                    .join(',   ');
                throw new AppError(`Validation Error: ${messages || 'Validation Failed'}`, 400);
            }
        } else {
            const zodSchema = schema as AnyZodObject;
            const result = zodSchema.safeParse({
                body: req.body,
                params: req.params,
            });

            if (!result.success) {
                const messages = result.error.errors
                    .map((err) => `${err.path.slice(-1)[0]}: ${err.message}`)
                    .join(',  ');
                throw new AppError(`Validation Error: ${messages || 'Validation Failed'}`, 400);
            }
        }

        next();
    });
};
