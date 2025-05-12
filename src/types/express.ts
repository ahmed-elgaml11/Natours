import {IUser} from '../api/users/user.model'
import { Document } from 'mongoose';

declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser & Document; 
    }
}