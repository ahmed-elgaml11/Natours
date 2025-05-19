import { Request, Response, NextFunction } from 'express';
import { catchAsync } from "../../utils/catchAsync";
import * as Services from './review.services'
import { reviewResponse } from '../../types/reviewResponse';
import { IReview } from './review.model';

export const getAllReviews = catchAsync(async(req: Request, res: Response<reviewResponse>, next: NextFunction) => {
    let filter = {}
    if(req.params.tourId)  filter = { tour: req.params.tourId }
    const reviews = await Services.getAllReviews(filter)

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})
export const addReview = catchAsync(async(req: Request<{tourId: string}, reviewResponse, IReview>, res: Response<reviewResponse>, next: NextFunction) => {
    if(!req.body.tour)  req.body.tour = req.params.tourId
    if(!req.body.user)  req.body.user = req.user!.id
    const review = await Services.addReview(req.body)

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})