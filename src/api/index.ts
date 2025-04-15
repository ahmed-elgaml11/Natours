import express from "express";
import firstResponse from "../types/firstResponse";
import tourRoutes from './tours/tour.routes'
import userRoutes from './users/user.routes'
const router = express.Router();

router.get<{}, firstResponse>('/', (req, res) => {
    res.status(200).json({
        message: 'hello from api.'
    })
})

router.use('/tours', tourRoutes)
router.use('/users', userRoutes)
export default router