import express from "express";
const router = express.Router();
import * as tourControllers from './tour.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { tourSchema } from "./tour.schema";
import { topTours } from "../../middlewares/tours/topTouts";
import { protect, restrictTo } from '../../middlewares/protectRoutes'

router.get('/top-5-tours', topTours, tourControllers.getAllTours)   //limit=5&sort=-ratingAverages,price
router.get('/tour-stats', tourControllers.tourStats )                    //aggredation pipeline
router.get('/monthly-plan/:year', tourControllers.monthlyPlan)

router
    .route('/')
    .get(protect, tourControllers.getAllTours)
    .post(validateRequest(tourSchema, ['body']), tourControllers.addTour)

router 
    .route('/:id')
    .get(validateRequest(tourSchema, ['params']), tourControllers.getTour)
    .patch(validateRequest(tourSchema, ['params', 'halfBody']), tourControllers.updateTour)
    .delete(validateRequest(tourSchema, ['params']), protect, restrictTo(['admin', 'lead-guide']), tourControllers.deleteTour)


export default router