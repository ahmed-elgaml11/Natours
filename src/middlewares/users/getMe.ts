import { Request, Response, NextFunction } from 'express';

export const getMe = (req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user?.id
    next();
}