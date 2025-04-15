import express from "express";
const router = express.Router();
import * as tourControllers from './tour.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { tourSchema } from "./tour.schema";


router
    .route('/')
    .get(tourControllers.getAllTours)
    .post(validateRequest(tourSchema), tourControllers.addTour)

router 
    .route('/:id')
    .get(tourControllers.getTour)
    .patch(tourControllers.updateTour)
    .delete(tourControllers.deleteTour)


export default router