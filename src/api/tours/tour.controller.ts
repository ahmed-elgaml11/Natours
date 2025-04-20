import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { toursResponse } from '../../types/toursResponse';
import * as Servises from './tour.services'
import { AppError } from '../../utils/appError';
import { ITour } from './tour.model'
import { updatedTourType } from './tour.schema'

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
export const addTour = catchAsync(async(req: Request<{}, toursResponse, ITour>, res: Response<toursResponse>, next: NextFunction) => {
    const {name} =  req.body
    const existingTour = await Servises.getTour(name);
    if(existingTour){
        throw new AppError('unavailable Tour name, choose another one!.', 400)
    }
    const newTour = await Servises.addTour(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})
export const getTour = catchAsync(async(req: Request<{id: string}, toursResponse, {}>, res: Response<toursResponse>, next: NextFunction) => {
    const {id} = req.params
    const tour = await Servises.getTourbyId(id);
    if(!tour){
        throw new AppError('No tour found with that ID', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })


})
export const updateTour = catchAsync(async(req: Request<{id: string}, toursResponse, updatedTourType >, res: Response<toursResponse>, next: NextFunction) => {
    const {id} = req.params
    const updateTour = await Servises.updateTour(id, req.body);
    if(!updateTour){
        throw new AppError('No tour found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: updateTour
        }
    })


})
export const deleteTour = catchAsync(async(req: Request, res: Response<toursResponse>, next: NextFunction) => {
    const {id} = req.params
    const deletedTour = await Servises.deletedTour(id);
    if(!deletedTour){
        throw new AppError('No tour found with that ID', 404);
    }

    res.status(204).json({
        status: 'success',
        data: {

        }
    });
    


})
