import express from "express";
const router = express.Router();
import tourControllers from './tour.controller'


router
    .route('/')
    .get(tourControllers.getAllTours)
    .post(tourControllers.addTour)

router 
    .route('/:id')
    .get(tourControllers.getTour)
    .patch(tourControllers.updateTour)
    .delete(tourControllers.deleteTour)


export default router