import multer from 'multer'
import { AppError } from '../utils/appError';
import { Request } from 'express'
type FileFilterCallback =  (error: Error | null, acceptFile: boolean) => void

// const storage = multer.diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
//         cb(null, uploadDir)
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
//         const ext = file.mimetype.split('/')[1]
//         cb(null, `${req.user?.id}-${Date.now()}.${ext}`)
//     }
// })

const storage = multer.memoryStorage()

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if(!file) return cb(null, true);
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