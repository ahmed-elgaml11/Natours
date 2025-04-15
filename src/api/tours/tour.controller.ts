import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Tour } from './tour.model';
import { toursResponse } from '../../types/toursResponse';
export const getAllTours = catchAsync(async(req: Request, res: Response<toursResponse>, next: NextFunction) => {
    const tours = await Tour.find();

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        } 
    })
})
export const addTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
export const getTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
export const updateTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
export const deleteTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
