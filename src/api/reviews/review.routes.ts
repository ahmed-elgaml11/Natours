import  express  from "express";
const router = express.Router({ mergeParams: true });
import * as reviewController from './review.controller'
import { protect, restrictTo } from "../../middlewares/protectRoutes";
import {validateRequest} from '../../middlewares/validateRequest'
import { createReviewBodySchema, getReviewSchema, updateReviewShema } from './review.schema'
import * as reviewControllers from './review.controller'
import { setUserTourId } from '../../middlewares/reviews/userAndTourId'
router
    .route('/')
        .get(protect, restrictTo(['admin']), reviewController.getAllReviews)
        .post(protect, setUserTourId, validateRequest(createReviewBodySchema), restrictTo(['user']), reviewController.addReview)

router
    .route('/:id')
        .get(validateRequest(getReviewSchema),  protect, restrictTo(['admin']), reviewControllers.getReview)    
        .patch(validateRequest(updateReviewShema), protect, restrictTo(['user']), reviewControllers.updateReview)    
        .delete(validateRequest(getReviewSchema),  protect, restrictTo(['user', 'admin']), reviewControllers.deleteReview)    

export default router