import express from "express";
const router = express.Router();
import * as tourControllers from './tour.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { tourSchema } from "./tour.schema";
import { topTours } from "../../middlewares/tours/topTouts";
import { protect, restrictTo } from '../../middlewares/protectRoutes'
import reviewRoutes from '../reviews/review.routes'
import { uniqueTourName } from "../../middlewares/tours/uniqueName";
import upload from "../../middlewares/upload";
import { resizeTourPhoto } from '../../middlewares/resizePhoto'
import { uploadTourImages } from '../../middlewares/tours/uploadPhotos'
import { createBookingCheckout } from '../../middlewares/bookings/createBooking'
import bookingRoutes from '../bookings/booking.routes'




router.get('/top-5-tours', topTours, tourControllers.getAllTours)   //limit=5&sort=-ratingAverages,price
router.get('/tour-stats', tourControllers.tourStats)                    //aggredation pipeline
router.get('/monthly-plan/:year', protect, restrictTo(['admin', 'lead-guide', 'guide']), tourControllers.monthlyPlan)

router.get('/tours-within/:distance/center/:latlng/unit/:unit', tourControllers.getToursWithin)
router.get('/distances/:latlng/unit/:unit', tourControllers.getDistances)

router.get('/my-tours', protect, tourControllers.getMyTours)

router
    .route('/')
    .get(createBookingCheckout, tourControllers.getAllTours)
    .post(protect, restrictTo(['admin', 'lead-guide']), validateRequest(tourSchema, ['body']), uniqueTourName, tourControllers.addTour)

router
    .route('/:id')
    .get(validateRequest(tourSchema, ['params']), tourControllers.getTour)
    .patch(protect, restrictTo(['admin', 'lead-guide']), upload.fields([
        {name: 'imageCover', maxCount: 1},
        {name: 'images', maxCount: 3}
    ]), validateRequest(tourSchema, ['params', 'halfBody']), resizeTourPhoto, uploadTourImages,  tourControllers.updateTour)
    
    .delete(protect,  restrictTo(['admin', 'lead-guide']), validateRequest(tourSchema, ['params']),  tourControllers.deleteTour)






router.use('/:tourId/reviews', reviewRoutes)
router.use('/:tourId/bookings', bookingRoutes)


export default router