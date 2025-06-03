import { Request, Response, NextFunction } from 'express';
import * as tourServices from '../../api/tours/tour.services'
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';
export const uniqueTourName = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const existingTour = await tourServices.getTour(req.body.name);
    if (existingTour) {
        throw new AppError('unavailable Tour name, choose another one!.', 400)
    }
    next()
})