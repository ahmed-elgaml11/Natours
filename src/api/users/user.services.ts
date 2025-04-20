import { User } from "./user.model"
import { IUser } from "./user.model"
export const createUser = async (body: IUser) => {
    return User.create(body)
}