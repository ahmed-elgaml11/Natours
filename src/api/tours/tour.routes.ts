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
    .get(tourControllers.getAllTours)
    .post(protect, restrictTo(['admin', 'lead-guide']), validateRequest(tourSchema, ['body']), uniqueTourName, tourControllers.addTour)

router
    .route('/:id')
    .get(validateRequest(tourSchema, ['params']), tourControllers.getTour)
    .patch(protect, restrictTo(['admin', 'lead-guide']), validateRequest(tourSchema, ['params', 'halfBody']),  tourControllers.updateTour)
    .delete(protect,  restrictTo(['admin', 'lead-guide']), validateRequest(tourSchema, ['params']),  tourControllers.deleteTour)



router.get('/top-5-tours', topTours, tourControllers.getAllTours)   //limit=5&sort=-ratingAverages,price
router.get('/tour-stats', tourControllers.tourStats)                    //aggredation pipeline
router.get('/monthly-plan/:year', protect, restrictTo(['admin', 'lead-guide', 'guide']), tourControllers.monthlyPlan)



router.use('/:tourId/reviews', reviewRoutes)


export default router