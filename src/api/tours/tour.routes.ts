import express from "express";
const router = express.Router();
import * as tourControllers from './tour.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { tourSchema } from "./tour.schema";


router
    .route('/')
    .get(tourControllers.getAllTours)
    .post(validateRequest(tourSchema, ['body']), tourControllers.addTour)

router 
    .route('/:id')
    .get(validateRequest(tourSchema, ['params']), tourControllers.getTour)
    .patch(validateRequest(tourSchema, ['params', 'halfBody']), tourControllers.updateTour)
    .delete(validateRequest(tourSchema, ['params']), tourControllers.deleteTour)


export default router