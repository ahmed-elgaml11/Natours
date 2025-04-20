import express from "express";
const router = express.Router();
import * as userController from './user.controller'
import * as authController from './auth.controller'

router.post(/'signup', authController.signup)
router
    .route('/')
    .get(userController.getUsere)
    .post(userController.addUser)

router
    .route('/:id')
    .get(userController.getUser)    
    .patch(userController.updateUser)    
    .delete(userController.deleteUser)    

export default router