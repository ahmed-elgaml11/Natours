import mongoose from "mongoose";
import validator from "validator";
export interface IUser {
    name: string;
    email: string;
    photo?: string;
    role: 'user' | 'guide' | 'lead-guide' | 'admin';
    password: string;
    passwordConfirm: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
    }
})
export const User = mongoose.model<IUser>('User', userSchema)