import { Request, Response, NextFunction } from 'express';
import { catchAsync } from "../../utils/catchAsync";
import * as Services from './review.services'
import { reviewResponse } from '../../types/reviewResponse';
import { IReview } from './review.model';

export const getAllReviews = catchAsync(async(req: Request, res: Response<reviewResponse>, next: NextFunction) => {
    const reviews = await Services.getAllReviews()

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})
export const addReview = catchAsync(async(req: Request<{}, reviewResponse, IReview>, res: Response<reviewResponse>, next: NextFunction) => {
    const review = await Services.addReview(req.body)

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})