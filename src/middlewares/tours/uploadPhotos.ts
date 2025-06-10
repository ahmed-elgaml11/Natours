import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { cloudinaryUploadImage } from '../../utils/cloudinary';
import fs from 'fs'

export const uploadTourImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files)
        return next()

    if (!Array.isArray(req.files)) {
        if (req.files.imageCover && Array.isArray(req.files.imageCover)) {

            const result = await cloudinaryUploadImage(req.files.imageCover[0].path)
            await fs.promises.unlink(req.files.imageCover[0].path)

            req.body.imageCover = result.secure_url
        }
        if (req.files.images && Array.isArray(req.files.images)) {
            req.body.images = []
            await Promise.all(
                req.files.images.map(async file => {
                    const result = await cloudinaryUploadImage(file.path)
                    await fs.promises.unlink(file.path)

                    req.body.images.push(result.secure_url)
                })
            )
        }

    }
    next()
})