import { Request, Response, NextFunction } from 'express';
import * as Services from './user.services'
import { userResponce } from '../../types/userResponse';
import { IUser } from './user.model';
import { catchAsync } from '../../utils/catchAsync';
import jwt, { SignOptions } from 'jsonwebtoken';
import { signToken } from '../../utils/jwt'
import { AppError } from '../../utils/appError';
export const signup = catchAsync(async (req: Request<{}, userResponce, IUser>, res: Response<userResponce>, next: NextFunction) => {
    const user = await Services.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    // const token : string = signToken({id: user._id}, {expiresIn: process.env.JWT_EXPIRESIN })
    const { JWT_SECRET, JWT_EXPIRESIN } = process.env ;
    if(!JWT_SECRET || JWT_EXPIRESIN ){
        throw new AppError('JWT env variables are not defined', 500);
    }
    
    const token = jwt.sign({id: user._id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRESIN 
    }as SignOptions)
    
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
        
    })

})
// export const signup = catchAsync(async (req: Request<{}, userResponce, IUser >, res: Response<userResponce>, next: NextFunction) => {
// })
// export const signup = catchAsync(async (req: Request<{}, userResponce, IUser >, res: Response<userResponce>, next: NextFunction) => {
// })
// export const signup = catchAsync(async (req: Request<{}, userResponce, IUser >, res: Response<userResponce>, next: NextFunction) => {
// })
// export const signup = catchAsync(async (req: Request<{}, userResponce, IUser >, res: Response<userResponce>, next: NextFunction) => {
// })
