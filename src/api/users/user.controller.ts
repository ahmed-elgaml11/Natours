import { catchAsync } from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import * as Services from './user.services'
import { userResponce } from '../../types/userResponse';
import { AppError } from '../../utils/appError';
import { UpdateMeBody } from './user.schema';

export const updateMe = catchAsync(async (req: Request<{}, userResponce, UpdateMeBody >, res: Response<userResponce>, next: NextFunction) => {
    if(req.body.password || req.body.passwordConfirm){
        return next (new AppError('use /updatePaswword ', 400))
    }

    const allowedObg = Services.allowedObj<UpdateMeBody>(req.body, ['email', 'name'])

    const updatedUser = await Services.updateData<UpdateMeBody>(req.user!._id as string, allowedObg)

    res.status(200).json({
        status: 'success', 
        data: {
            user: updatedUser
        }
    })
})


export const deleteMe = catchAsync(async(req: Request,  res: Response<userResponce>, next: NextFunction) => {

    await Services.inActiveUser(req.user!._id as string)

    res.status(204).json({
        status: 'success',
    })
})