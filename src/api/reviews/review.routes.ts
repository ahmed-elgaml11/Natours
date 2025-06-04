import  express  from "express";
const router = express.Router({ mergeParams: true });
import * as reviewController from './review.controller'
import { protect, restrictTo } from "../../middlewares/protectRoutes";
import {validateRequest} from '../../middlewares/validateRequest'
import { createReviewBodySchema, getReviewSchema, updateReviewShema } from './review.schema'
import * as reviewControllers from './review.controller'
import { setUserTourId } from '../../middlewares/reviews/userAndTourId'

router.use(protect)

router
    .route('/')
        .get(reviewController.getAllReviews)
        .post(restrictTo(['user']), setUserTourId, validateRequest(createReviewBodySchema), reviewController.addReview)

router
    .route('/:id')
        .get(validateRequest(getReviewSchema), reviewControllers.getReview)    
        .patch(validateRequest(updateReviewShema), restrictTo(['user', 'admin']), reviewControllers.updateReview)    
        .delete(validateRequest(getReviewSchema), restrictTo(['user', 'admin']), reviewControllers.deleteReview)    

export default router