import { Request, Response, NextFunction } from 'express';
import * as Services from './user.services'
import { userResponce } from '../../types/userResponse';
import { IUser } from './user.model';
import { catchAsync } from '../../utils/catchAsync';

export const signup = catchAsync(async (req: Request<{}, userResponce, IUser>, res: Response<userResponce>, next: NextFunction) => {
    const user = await Services.createUser(req.body)
    res.status(201).json({
        status: 'success',
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
