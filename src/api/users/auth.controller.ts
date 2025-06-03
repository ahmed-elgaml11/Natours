import { Request, Response, NextFunction } from 'express';
import * as Services from './user.services'
import { userResponce } from '../../types/userResponse';
import { IUser, IUserInput } from './user.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';
import { signToken } from '../../utils/jwt';
import { LoginType, Email, ResetPassword } from './user.schema';
import { sendEmail } from '../../utils/email';
import crypto from 'crypto'



export const signup = catchAsync(async (req: Request<{}, userResponce, IUserInput>, res: Response<userResponce>, next: NextFunction) => {
    const existUser = await Services.findUser(req.body.email)
    if (existUser) {
        throw new AppError('this email is already exists, choose another one.', 400)
    }
    const user = await Services.createOne({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    })
    Services.createSendToken(user, res, 201)

})

export const login = catchAsync(async (req: Request<{}, userResponce, LoginType>, res: Response<userResponce>, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await Services.findUser(email);

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Incorrect email or password', 401)
    }
    Services.createSendToken(user, res, 200)
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
            subject: 'this link is valid for 10 minutes only',
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
export const resetPassword = catchAsync(async (req: Request<{ token: string }, userResponce, ResetPassword>, res: Response<userResponce>, next: NextFunction) => {
    //1- get the user based on the token
    const token = req.params.token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await Services.findUserByToken(hashedToken)


    //2- if the user exists and the token is not expired , set the new password and update change password at
    if (!user) {
        return next(new AppError('Invalid Or Expired Token', 400))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.PasswordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()



    // 3- log he user in (send jwt)
    Services.createSendToken(user, res, 200)

})

export const updateMyPassword = catchAsync(async (req: Request, res: Response<userResponce>, next: NextFunction) => {
    // 1-  get the user
    const user = await Services.findUserWithPassById(req.user!._id.toString());
    if (!user) {
        throw new AppError('user not found', 404)
    }

    // 2- check if the password is correct 
    const isMatch = await user.correctPassword(req.body.currentPassword, user.password)
    if (!isMatch)
        return next(new AppError('Incorrect current password', 401));

    // 3- if correct , update the password 
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm

    await user.save()
    // 4- log the user in (send jwt)
    Services.createSendToken(user, res, 200)
})
// export const signup = catchAsync(async (req: Request<{}, userResponce, IUser >, res: Response<userResponce>, next: NextFunction) => {
// })
