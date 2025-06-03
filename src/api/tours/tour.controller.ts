import { Request, Response, NextFunction, json } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { toursResponse } from '../../types/toursResponse';
import * as tourServices from './tour.services'
import * as factory from '../../utils/handlerFactory'



export const getAllTours = factory.getAll('tour')

export const addTour = factory.createOne('tour')

export const getTour = factory.getOne('tour')

export const updateTour = factory.updateOne('tour')

export const deleteTour = factory.deleteOne('tour')


export const tourStats = catchAsync(async (req: Request, res: Response<toursResponse>, next: NextFunction) => {
    const stats = await tourServices.tourStats();
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })

})

export const monthlyPlan = catchAsync(async (req: Request, res: Response<toursResponse>, next: NextFunction) => {
    const year = Number(req.params.year);
    const plan = await tourServices.monthlyPlan(year)

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })

})

