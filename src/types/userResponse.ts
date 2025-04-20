import {IUser} from '../api/users/user.model'
export interface userResponce {
    status?: string,
    results?: number,
    data?: {
        user?: IUser ,
        users?: IUser[]
    }
}