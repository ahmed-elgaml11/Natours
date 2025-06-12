import express from "express";
import firstResponse from "../types/firstResponse";
import tourRoutes from './tours/tour.routes'
import userRoutes from './users/user.routes'
import reviewRoutes from './reviews/review.routes'
import authRoutes from './users/auth.routes'
import bookingRoutes from './bookings/booking.routes'
const router = express.Router();

router.get<{}, firstResponse>('/', (req, res) => {
    res.status(200).json({
        message: 'hello from api.'
    })
})

router.use('/tours', tourRoutes)
router.use('/users', userRoutes)
router.use('/reviews', reviewRoutes)
router.use('/auth', authRoutes)
router.use('/bookings', bookingRoutes)
export default router