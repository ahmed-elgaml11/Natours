import multer from 'multer'
import fs from 'fs'
import { AppError } from '../utils/appError';
import { Request } from 'express'
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
type FileFilterCallback =  (error: Error | null, acceptFile: boolean) => void
const uploadDir = 'uploads/img/users';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, uploadDir)
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `${req.user?.id}-${Date.now()}.${ext}`)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype && !file.mimetype.startsWith('image/')) {
        return cb(new AppError('Only images are allowed!', 400), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage, fileFilter: fileFilter as unknown as (
        req: Request,
        file: Express.Multer.File,
        callback: multer.FileFilterCallback
    ) => void, limits: { fileSize: 10 * 1024 * 1024 }
});
export default upload