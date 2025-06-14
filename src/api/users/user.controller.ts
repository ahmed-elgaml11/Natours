import { catchAsync } from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import * as service from './user.services'
import { userResponce } from '../../types/userResponse';
import { AppError } from '../../utils/appError';
import { UpdateMeBody } from './user.schema';
import * as factory from '../../utils/handlerFactory'
import { cloudinaryUploadImage, cloudinaryRemoveImage } from '../../utils/cloudinary'
import fs from 'fs'

export const updateMe = catchAsync(async (req: Request<{}, userResponce, UpdateMeBody>, res: Response<userResponce>, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('use /updatePaswword ', 400))
    }

    const allowedObj = service.allowedObj<UpdateMeBody>(req.body, ['email', 'name'])

    if (req.file) {
        const path = `${__dirname}/../../../uploads/img/users/${req.file.filename}`
        try {
            if (req.user?.photoId) {
                await cloudinaryRemoveImage(req.user?.photoId)

            }
            const result = await cloudinaryUploadImage(path)
            allowedObj.photo = result.secure_url
            allowedObj.photoId = result.public_id
            await fs.promises.unlink(path)
        }
        catch (err) {
            console.error('Cloudinary error:', err);
            await fs.promises.unlink(path);
        }

    }


    const updatedUser = await service.updateData<UpdateMeBody>(req.user?._id as string, allowedObj)

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})


export const deleteMe = catchAsync(async (req: Request, res: Response<userResponce>, next: NextFunction) => {

    await service.inActiveUser(req.user!._id as string)

    res.status(204).json({
        status: 'success',
    })
})

export const getAllUsers = factory.getAll('user')

export const updateUser = factory.updateOne('user')

export const deleteUser = factory.deleteOne('user')

export const getUser = factory.getOne('user')

