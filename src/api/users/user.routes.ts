import express from "express";
const router = express.Router();
import * as userController from './user.controller'
import { validateRequest } from "../../middlewares/validateRequest";
import {  updateMeSchema, getUserSchema, updateUserSchema,} from "./user.schema";
import { protect, restrictTo } from "../../middlewares/protectRoutes";
import { getMe } from "../../middlewares/users/getMe";




router.patch('/updateMe', validateRequest(updateMeSchema), protect, userController.updateMe)
router.delete('/deleteMe', protect, userController.deleteMe)
router.get('/me', protect, getMe, userController.getUser)


router
    .route('/')
        .get(protect, restrictTo(['admin']),  userController.getAllUsers)

router
    .route('/:id')
        .get(protect, restrictTo(['admin']), validateRequest(getUserSchema), userController.getUser)    
        .patch(protect, restrictTo(['admin', 'user']), validateRequest(updateUserSchema), userController.updateUser)    
        .delete(protect, restrictTo(['admin']), validateRequest(getUserSchema), userController.deleteUser)    


export default router