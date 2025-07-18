import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { verifySignToken } from '../utils/jwt';
import { getOneById } from '../api/users/user.services';
import { ITour } from '../api/tours/tour.model';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1- check if there is a token and get it
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new AppError('Please Login to get access', 401))
    }

    // 2- verify token that it is (not tampered or expired)
    const decoded = await verifySignToken(token)


    // 3- check if the user still exists (if a customer blocked or fired or removed from the db)
    const user = await getOneById(decoded.id)
    if (!user) {
        return next(new AppError('the user beloginig to this token is not exists', 401))
    }



    // 4- check if the user changes the password after token is issued
    if (user.changePasswordAfter(decoded.iat!)) {
        return next(new AppError('User recently changed the password, please log in again', 401))
    }

    req.user = user

    next()

})

export const restrictTo = (roles: ('user' | 'guide' | 'lead-guide' | 'admin')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role!)) {
            return next(new AppError('you do not have permission to perform this action', 403))
        }

        next()
    }
}


// unused code for ABAC,  just for learning
type Project = null
export const authorize = (policy: Function, resource: Project) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(policy(user, resource)){
        return next()
    }
    return next(new AppError('Access Denied', 403))

}
// and we will write inside the controller route handller: 

// authorize(canViewProject, project)(req, res, () => {

// })