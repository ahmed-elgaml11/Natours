import express from "express";
import firstResponse from "../interfaces/firstResponse";
import something from './tours/tour.routes'
const router = express.Router();

router.get<{}, firstResponse>('/', (req, res) => {
    res.json({
        message: 'hello from api.'
    })
})

router.use('/something', something)
export default router