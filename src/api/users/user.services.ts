import mongoose from "mongoose"
import { IUserInput, User } from "./user.model"
import { IUser } from "./user.model"

export const createUser = async (body: IUserInput) => {
    return User.create(body)
}
export const findUser = async(email: string) => {
    return User.findOne({ email }).select('+password')
}

export const findUserById = async (id: string) => {
    return User.findById(id)
}