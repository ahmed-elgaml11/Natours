import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { toursResponse } from '../../types/toursResponse';
import * as tourServices from './tour.services'
import * as factory from '../../utils/handlerFactory'
import { AppError } from '../../utils/appError';
import * as bookingServices from '../bookings/booking.services'
import { Tour } from './tour.model';


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


export const getToursWithin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')
    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in a format lat,lng', 400))
    }

    const radius: number = unit === 'mi' ? parseFloat(distance) / 3963.2 : parseFloat(distance) / 6378.1

    const tours = await tourServices.getAll({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    })

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }

    })
})

export const getDistances = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')
    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in a format lat,lng', 400))
    }

    const multiplier = unit === 'mi' ? 0.00062137 : 0.001

    const distances = await tourServices.calcDistances(lng, lat, multiplier)


    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    })
})


export const getMyTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await bookingServices.getAll({ user: req.user?.id })

    const tourIds = bookings.map(ele => ele.tour)
    const tours = await Tour.find({ _id: { $in: tourIds } })

    res.status(200).json({
        status: 'success',
        data: {
            tours
        }
    })

}) 