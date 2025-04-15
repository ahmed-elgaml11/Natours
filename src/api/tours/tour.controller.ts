import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { toursResponse } from '../../types/toursResponse';
import * as Servises from './tour.services'
export const getAllTours = catchAsync(async(req: Request, res: Response<toursResponse>, next: NextFunction) => {
    const tours = await Servises.getAllTours();

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        } 
    })
})
export const addTour = catchAsync(async(req: Request, res: Response<toursResponse>, next: NextFunction) => {
    const newTour = await Servises.addTour(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})
export const getTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
export const updateTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
export const deleteTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
