import express from "express";
import firstResponse from "../interfaces/firstResponse";
import tourRoutes from './tours/tour.routes'
import userRoutes from './tours/tour.routes'
const router = express.Router();

router.get<{}, firstResponse>('/', (req, res) => {
    res.json({
        message: 'hello from api.'
    })
})

router.use('/tours', tourRoutes)
router.use('/users', userRoutes)
export default router