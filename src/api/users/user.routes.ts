import express from "express";
const router = express.Router();
import * as userController from './user.controller'
import * as authController from './auth.controller'
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserSchema, createUpdatePasswordSchema, updateMeSchema, getUserSchema, updateUserSchema, createUserLoginSchema, userForgetPasswordSchema, createResetPasswordSchema} from "./user.schema";
import { protect } from "../../middlewares/protectRoutes";

router.post('/signup', validateRequest(createUserSchema), authController.signup)
router.post('/login', validateRequest(createUserLoginSchema), authController.login)

router.post('/forgetPassword', validateRequest(userForgetPasswordSchema), authController.forgetPassword)
router.patch('/resetPassword/:token', validateRequest(createResetPasswordSchema), authController.resetPassword)
router.patch('/updateMyPassword', validateRequest(createUpdatePasswordSchema), protect, authController.updateMyPassword)



router.patch('/updateMe', validateRequest(updateMeSchema), protect, userController.updateMe)
router.delete('/deleteMe', protect, userController.deleteMe)





// router
//     .route('/')
//     .get(userController.getAllUsers)
//     .post(validateRequest(createUserSchema), userController.addUser)

// router
//     .route('/:id')
//     .get(validateRequest(getUserSchema), userController.getUser)    
//     .patch(validateRequest(updateUserSchema), userController.updateUser)    
//     .delete(validateRequest(getUserSchema), userController.deleteUser)    

export default router