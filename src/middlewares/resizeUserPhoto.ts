import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs'
const uploadDir = 'uploads/img/users';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const resizeUserPhoto = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file)
        return next()

    req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`

    sharp(req.file.buffer).
        resize(500, 500).
        toFormat('jpeg').
        jpeg({ quality: 90 }).
        toFile(`uploads/img/users/${req.file.filename}`)

    next()
}