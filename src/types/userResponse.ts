import {IUser} from '../api/users/user.model'
export interface userResponce {
    status?: string,
    results?: number,
    token?: string,
    data?: {
        user?: IUser ,
        users?: IUser[]
    }
}

