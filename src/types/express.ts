import {IUser} from '../api/users/user.model'

declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser; 
    }
}