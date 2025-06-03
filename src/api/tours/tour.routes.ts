import express from "express";
const router = express.Router();
import * as tourControllers from './tour.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { tourSchema } from "./tour.schema";
import { topTours } from "../../middlewares/tours/topTouts";
import { protect, restrictTo } from '../../middlewares/protectRoutes'
import reviewRoutes from '../reviews/review.routes'
import { uniqueTourName } from "../../middlewares/tours/uniqueName";


router
    .route('/')
    .get(protect, tourControllers.getAllTours)
    .post( protect, restrictTo(['admin']), validateRequest(tourSchema, ['body']), uniqueTourName, tourControllers.addTour)

router
    .route('/:id')
    .get(protect, validateRequest(tourSchema, ['params']), tourControllers.getTour)
    .patch(protect, validateRequest(tourSchema, ['params', 'halfBody']), restrictTo(['admin']), tourControllers.updateTour)
    .delete(protect, validateRequest(tourSchema, ['params']),  restrictTo(['admin', 'lead-guide']), tourControllers.deleteTour)



router.get('/top-5-tours', topTours, tourControllers.getAllTours)   //limit=5&sort=-ratingAverages,price
router.get('/tour-stats', tourControllers.tourStats)                    //aggredation pipeline
router.get('/monthly-plan/:year', tourControllers.monthlyPlan)



router.use('/:tourId/reviews', reviewRoutes)


export default router