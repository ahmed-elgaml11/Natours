import { catchAsync } from "./catchAsync"
import { Request, Response, NextFunction } from 'express';
import { AppError } from "./appError";
import * as tourServices from '../api/tours/tour.services'
import * as userServices from '../api/users/user.services'
import * as reviewServices from '../api/reviews/review.services'
import { IReview } from '../api/reviews/review.model'
import { IUserInput } from '../api/users/user.model'
import { ITour } from '../api/tours/tour.model'
import { APIFeatures } from './queryFeatures'
import { Query } from "mongoose";


type ModelName = 'tour' | 'user' | 'review'
type ModelTypeMap = {
    tour: ITour;
    user: IUserInput;
    review: IReview;
};
interface ServiceType<T> {
    getAll: (filter: Object) => Query<any, any>
    createOne: (body: T) => Promise<any>
    getOneById: (id: string) => Promise<any>
    updateOne: (id: string, body: Partial<T>) => Promise<any>,
    deleteOne: (id: string) => Promise<any>,
}
const serviceMap: { [k in ModelName]: ServiceType<ModelTypeMap[k]> } = {
    tour: tourServices,
    user: userServices,
    review: reviewServices
}

export const getAll = (model: ModelName) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const service = serviceMap[model]
        let filter = {}
        if (req.params.tourId) filter = { tour: req.params.tourId }

        const features = new APIFeatures(service.getAll(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        // const docs = await features.query.explain()
        const docs = await features.query

        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                data: docs
            }
        })
    })

export const createOne = (model: ModelName) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const service = serviceMap[model]
        const newDoc = await service.createOne(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                data: newDoc
            }
        })
    })

export const getOne = (model: ModelName) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const service = serviceMap[model]
        const doc = await service.getOneById(id);
        if (!doc) {
            throw new AppError('No Document found with that ID', 404);
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        })

    })


export const updateOne = (model: ModelName) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const service = serviceMap[model]
        const updateDoc = await service.updateOne(id, req.body);
        if (!updateDoc) {
            throw new AppError('No Document found with that ID', 404);
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: updateDoc
            }
        })


    })


export const deleteOne = (model: ModelName) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const service = serviceMap[model]
        const deletedDoc = await service.deleteOne(id);
        if (!deletedDoc) {
            throw new AppError('No Document found with that ID', 404);
        }
        res.status(204).json({
            status: 'success',
            data: {

            }
        });

    })

