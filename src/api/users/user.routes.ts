import express from "express";
const router = express.Router();
import * as userController from './user.controller'
import { validateRequest } from "../../middlewares/validateRequest";
import {  updateMeSchema, getUserSchema, updateUserSchema,} from "./user.schema";
import {protect, restrictTo } from "../../middlewares/protectRoutes";
import { getMe } from "../../middlewares/users/getMe";


router.use(protect)

router.patch('/updateMe', validateRequest(updateMeSchema), userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)
router.get('/me', getMe, userController.getUser)

router.use(restrictTo(['admin']))

router
    .route('/')
        .get(userController.getAllUsers)

router
    .route('/:id')
        .get(validateRequest(getUserSchema), userController.getUser)    
        .patch(validateRequest(updateUserSchema), userController.updateUser)    
        .delete(validateRequest(getUserSchema), userController.deleteUser)    


export default router