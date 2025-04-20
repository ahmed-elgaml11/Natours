import express from "express";
const router = express.Router();
import * as userController from './user.controller'
import * as authController from './auth.controller'
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserSchema, getUserSchema, updateUserSchema } from "./user.schema";


router.post('/signup', validateRequest(createUserSchema), authController.signup)
router
    .route('/')
    .get(userController.getUsere)
    .post(validateRequest(createUserSchema), userController.addUser)

router
    .route('/:id')
    .get(validateRequest(getUserSchema), userController.getUser)    
    .patch(validateRequest(updateUserSchema), userController.updateUser)    
    .delete(validateRequest(getUserSchema), userController.deleteUser)    

export default router