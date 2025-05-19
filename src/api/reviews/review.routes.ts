import  express  from "express";
const router = express.Router();
import * as reviewController from './review.controller'
import { protect, restrictTo } from "../../middlewares/protectRoutes";
import {validateRequest} from '../../middlewares/validateRequest'
import { createReviewBodySchema } from './review.schema'
router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(validateRequest(createReviewBodySchema), protect, restrictTo(['user']), reviewController.addReview)

// router
//     .route('/:id')
//     .get(validateRequest(getUserSchema), userController.getUser)    
//     .patch(validateRequest(updateUserSchema), userController.updateUser)    
//     .delete(validateRequest(getUserSchema), userController.deleteUser)    

export default router