import { Request, Response, NextFunction } from 'express';
//limit=5&sort=-ratingsAverage,price
export const topTours = (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '5';
    req.query.sort='-ratingsAverage,price'
    req.query.fields='name,difficulty,summary,price,ratingsAverage'

    next()
}