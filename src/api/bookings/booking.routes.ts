import express from "express";
import { protect, restrictTo } from "../../middlewares/protectRoutes";
import { getBookingSchema, getTourBookingSchema, createBookingSchema, updateBookingSchema} from './booking.schema'
const router = express.Router({ mergeParams: true });
import * as bookingController from './booking.controller'
import { validateRequest } from "../../middlewares/validateRequest";

router.use(protect)

router.get('/checkout-session/:tourId', validateRequest(getTourBookingSchema), bookingController.getCheckoutSession)

router.use(restrictTo(['admin', 'lead-guide']))

router
    .route('/')
        .get(bookingController.getAllBookings)
        .post(validateRequest(createBookingSchema), bookingController.addBooking)

router
    .route('/:id')
        .get(validateRequest(getBookingSchema), bookingController.getBooking)    
        .patch(validateRequest(updateBookingSchema), bookingController.updateBooking)    
        .delete(validateRequest(getBookingSchema), bookingController.deleteBooking)    





export default router