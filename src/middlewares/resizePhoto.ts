import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs'
import { catchAsync } from '../utils/catchAsync';
const uploadDir = 'uploads/img/users';
const outputDir = 'uploads/img/tours';
import { cloudinaryUploadImage, cloudinaryRemoveImage } from '../utils/cloudinary'


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
export const resizeUserPhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file)
        return next()

    req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer).
        resize(500, 500).
        toFormat('jpeg').
        jpeg({ quality: 90 }).
        toFile(`uploads/img/users/${req.file.filename}`)

    next()
})
export const resizeTourPhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files)
        return next()

    if (!Array.isArray(req.files)) {
        if (req.files.imageCover && Array.isArray(req.files.imageCover)) {
            const filName = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
            req.files.imageCover[0].path = `${__dirname}/../../uploads/img/tours/${filName}`;
            await sharp(req.files.imageCover[0].buffer).
                resize(2000, 1333).
                toFormat('jpeg').
                jpeg({ quality: 90 }).
                toFile(req.files.imageCover[0].path)

        }
        if (req.files.images && Array.isArray(req.files.images)) {
            await Promise.all(
                req.files.images.map(async (File, i) => {
                    let filName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
                    File.path = `${__dirname}/../../uploads/img/tours/${filName}`;
                    await sharp(File.buffer).
                        resize(2000, 1333).
                        toFormat('jpeg').
                        jpeg({ quality: 90 }).
                        toFile(`uploads/img/tours/${filName}`)
                })
            )
        }
    }



    next()



})