import express from "express";
const router = express.Router();

import * as authController from './auth.controller'
import { createUserSchema, createUpdatePasswordSchema, createUserLoginSchema, userForgetPasswordSchema, createResetPasswordSchema} from "./user.schema";
import { validateRequest } from "../../middlewares/validateRequest";
import { protect } from "../../middlewares/protectRoutes";


router.post('/signup', validateRequest(createUserSchema), authController.signup)
router.post('/login', validateRequest(createUserLoginSchema), authController.login)
router.post('/forgetPassword', validateRequest(userForgetPasswordSchema), authController.forgetPassword)
router.patch('/resetPassword/:token', validateRequest(createResetPasswordSchema), authController.resetPassword)

router.patch('/updateMyPassword', validateRequest(createUpdatePasswordSchema), protect, authController.updateMyPassword)


router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.refreshToken)
export default router