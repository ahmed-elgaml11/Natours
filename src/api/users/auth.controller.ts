import { Request, Response, NextFunction } from 'express';
import * as Services from './user.services'
import { userResponce } from '../../types/userResponse';
import { IUser, IUserInput } from './user.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';
import { signToken } from '../../utils/jwt';
export const signup = catchAsync(async (req: Request<{}, userResponce, IUserInput>, res: Response<userResponce>, next: NextFunction) => {
    const user = await Services.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    const token : string = signToken({id: user._id})
    
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
        
    })

})

export const login = catchAsync (async (req: Request<{}, userResponce>, res: Response<userResponce>, next: NextFunction) => {
    const {email, password} = req.body;

    const user = await Services.findUser(email);

    if(!user || !(await user.correctPassword(password, user.password))){
        throw new AppError('Incorrect email or password', 401)
    }
    const token : string = signToken({id: user._id})
    res.status(200).json({
        status: 'success',
        token
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
