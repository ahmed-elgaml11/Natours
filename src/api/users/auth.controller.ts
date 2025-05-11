import { Request, Response, NextFunction } from 'express';
import * as Services from './user.services'
import { userResponce } from '../../types/userResponse';
import { IUser, IUserInput } from './user.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';
import { signToken } from '../../utils/jwt';
import { LoginType, Email } from './user.schema';
import { sendEmail } from '../../utils/email';
export const signup = catchAsync(async (req: Request<{}, userResponce, IUserInput>, res: Response<userResponce>, next: NextFunction) => {
    const existUser = await Services.findUser(req.body.email)
    if (existUser) {
        throw new AppError('this email is already exists, choose another one.', 400)
    }
    const user = await Services.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    })
    const token: string = signToken({ id: user._id })

    user.password = undefined as unknown as string
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }

    })

})

export const login = catchAsync(async (req: Request<{}, userResponce, LoginType>, res: Response<userResponce>, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await Services.findUser(email);

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Incorrect email or password', 401)
    }
    const token: string = signToken({ id: user._id })
    res.status(200).json({
        status: 'success',
        token
    })

})



export const forgetPassword = catchAsync(async (req: Request<{}, userResponce, Email>, res: Response<userResponce>, next: NextFunction) => {
    // 1- get the user 
    const user = await Services.findUser(req.body.email)
    if (!user) {
        return next(new AppError('there is no user with this email address', 404))
    }
    // 2- generate a token
    const resetToken = user.createPasswordRestetToken()
    await user.save({ validateBeforeSave: false })




    // 3- send a link to the user's email
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPssword/${resetToken}`

    const message = `submit a patch request with the new password and confirm password to: ${resetPasswordUrl}`

    try {

        await sendEmail({
            email: user.email,
            subject: 'this link token is valid for 10 minutes only',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'the link sent to the email'
        })

    }
    catch (err) {
        user.PasswordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save({ validateBeforeSave: false })

        return next(new AppError('there is an error sending the email', 500))

    }

})
export const resetPassword = catchAsync(async (req: Request<{}, userResponce, IUser>, res: Response<userResponce>, next: NextFunction) => {
})

// export const signup = catchAsync(async (req: Request<{}, userResponce, IUser >, res: Response<userResponce>, next: NextFunction) => {
// })
// export const signup = catchAsync(async (req: Request<{}, userResponce, IUser >, res: Response<userResponce>, next: NextFunction) => {
// })
