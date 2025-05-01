import { Request, Response, NextFunction, json } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { toursResponse } from '../../types/toursResponse';
import * as Servises from './tour.services'
import { AppError } from '../../utils/appError';
import { ITour, Tour } from './tour.model'
import { updatedTourType } from './tour.schema'

export const getAllTours = catchAsync(async(req: Request, res: Response<toursResponse>, next: NextFunction) => {
    // filtering
    const queryObj = {...req.query}
    const excludedFields = ['sort', 'page', 'limit', 'fields']
    excludedFields.forEach((ele) => delete queryObj[ele]) 

    //advanced filtering         ?age[gte]=10
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    //sort ('name age')                              ?sort=duration,name
    if(req.query.sort && typeof req.query.sort ==='string' ){
        const sortedBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortedBy)
    }else{
        query = query.sort('-createdAt')
    }

    // fields limiting: select(-name age)              ?fields=duration,name
    if(req.query.fields && typeof req.query.fields ==='string'){
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    }else{
        query = query.select('-__v')
    }



    //pagination               ?page=3&limit=3
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit

    query.skip(skip).limit(limit)

    if(req.query.page){
        const tourNums = await Tour.countDocuments()
        if(skip >= tourNums)  throw new AppError('this page dosnt exist', 404);
        
    }

    // execute Query
    const tours = await query



    // const tours = await Servises.getAllTours();

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
