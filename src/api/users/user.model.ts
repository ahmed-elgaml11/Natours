import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
export interface IUser {
    name: string;
    email: string;
    photo?: string;
    role?: 'user' | 'guide' | 'lead-guide' | 'admin';
    password: string;
    passwordConfirm: string;
    correctPassword: (pass1: string, pass2: string) => Promise<boolean>
    passwordChangedAt?: Date,
    changePasswordAfter: (tokenTime: number) => boolean
}
export interface IUserInput {
    name: string;
    email: string;
    photo?: string;
    role?: 'user' | 'guide' | 'lead-guide' | 'admin';
    password: string;
    passwordConfirm: string;
    passwordChangedAt?: Date,
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
        validate: {
            validator: function (ele) {
                return ele === this.password;
            },
            message: 'passwords don\'t match'
        },
    },
    passwordChangedAt: Date
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined as unknown as string;
    next();

})
// instance method
userSchema.methods.correctPassword = async (userPassword: string, hashedPassword: string) => {
    return bcrypt.compare(userPassword, hashedPassword)
}

userSchema.methods.changePasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        this.passwordChangedAt = new Date(this.passwordChangedAt);
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return changedTimestamp > JWTTimestamp;
    }
    return false;
};
export const User = mongoose.model<IUser>('User', userSchema)