import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';

export const setUserTourId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user!.id

    next()
})
