import { Request, Response, NextFunction } from 'express';
import { IUser, IUserInput, User } from "./user.model"
import { signToken } from '../../utils/jwt';
import { AppError } from '../../utils/appError';
import { generateRefreshToken } from '../../utils/jwt'
import { RefreshToken } from './refreshToken.model';
import crypto from 'crypto'

export const getAll = (filter: object) => {
    return User.find(filter);
}

export const createOne = async (body: IUserInput) => {
    return await User.create(body)
}

export const findUser = async (email: string) => {
    return await User.findOne({ email }).select('+password')
}

export const getOneById = async (id: string) => {
    return await User.findById(id)
}

export const deleteOne = async (id: string) => {
    return await User.findByIdAndDelete(id)
}

export const updateOne = async (id: string, body: Partial<IUser>) => {
    return await User.findByIdAndUpdate(id, body, {
        new: true,
    })
}


export const findUserByToken = async (token: string) => {
    return User.findOne({ PasswordResetToken: token, passwordResetExpires: { $gt: new Date(Date.now()) } })
}
export const findUserByWelcomeToken = async (token: string) => {
    return User.findOne({ welcomeToken: token, welcomeTokenExpires: { $gt: new Date(Date.now()) } })
}

export const findUserWithPassById = async (id: string) => {
    return await User.findById(id).select('+password')
}
export const allowedObj = <T>(body: T, fields: (keyof T)[]) => {
    const allowed: Partial<T> = {}
    // Object.keys(body).forEach(ele => {
    //     if (fields.includes(ele as keyof T))
    //         allowed[ele as keyof T ] = body[ele as keyof T]
    // });
    for (const field of fields) {
        if (body[field] !== undefined) {
            allowed[field] = body[field]
        }
    }
    return allowed
}
export const updateData = async<T>(id: string, data: Partial<T>) => {
    const user = await User.findOneAndUpdate({ _id: id }, data, {
        new: true,
        runValidators: true,
    });
    return user ?? undefined
};


export const inActiveUser = async (id: string) => {
    await User.findByIdAndUpdate(id, { isActive: false })
}


export const createSendToken = (user: IUser, res: Response, status: number) => {
    const token = signToken({ id: user._id })

    const cookieExpiresIn = process.env.COOKIE_EXPIRESIN
    if (!cookieExpiresIn) throw new AppError('missing env vars: COOKIE_EXPIRESIN ', 400)

    const cookieOptions = {
        expires: new Date(
            Date.now() + (Number(cookieExpiresIn) * 24 * 60 * 60 * 1000)
        ),
        httpOnly: true,
        secure: false
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions)
    user.password = undefined as unknown as string

    res.status(status).json({
        status: 'success',
        token: token,
        data: {
            user
        }
    })

}
export const createSignToken = (user: IUser, res: Response) => {
    const token = signToken({ id: user._id })

    const cookieExpiresIn = process.env.COOKIE_EXPIRESIN
    if (!cookieExpiresIn) throw new AppError('missing env vars: COOKIE_EXPIRESIN ', 400)

    const cookieOptions = {
        expires: new Date(
            Date.now() + (Number(cookieExpiresIn) * 24 * 60 * 60 * 1000)
        ),
        httpOnly: true,
        secure: false
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions)

}
export const createRereshToken = async (user: IUser, res: Response) => {
    const refreshToken = generateRefreshToken({ id: user._id });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

}

export const hashToken = (token: string) => {
    return crypto.createHash('sha256').update(token).digest('hex')
}