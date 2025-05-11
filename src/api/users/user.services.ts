import mongoose from "mongoose"
import { IUserInput, User } from "./user.model"
import { IUser } from "./user.model"
import { Document, Model, HydratedDocument } from 'mongoose';

export const createUser = async (body: IUserInput) => {
    return await User.create(body)
}
export const findUser = async(email: string) => {
    return await User.findOne({ email }).select('+password')
}

export const findUserById = async (id: string)  => {
    return await User.findById(id)
}

export const findUserByToken = async (token: string)  => {
    return  User.findOne({PasswordResetToken: token, passwordResetExpires: { $gt: new Date(Date.now()) }})
}