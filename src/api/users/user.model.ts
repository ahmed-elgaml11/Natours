import mongoose, { Document, Query, Types } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
export interface IUser extends Document  {
    _id: string | Types.ObjectId
    name: string;
    email: string;
    photo?: string;
    photoId?: string;
    role?: 'user' | 'guide' | 'lead-guide' | 'admin';
    password: string;
    passwordConfirm: string;
    correctPassword: (pass1: string, pass2: string) => Promise<boolean>
    passwordChangedAt?: Date,
    changePasswordAfter: (tokenTime: number) => boolean
    PasswordResetToken?: string
    passwordResetExpires?: Date
    welcomeToken?: string
    welcomeTokenExpires?: Date
    createPasswordRestetToken: () => string,
    createWelcomeToken: () => string,
    isActive?: boolean,
    emailVerified?: boolean
}
export interface IUserInput {
    name: string;
    email: string;
    photo?: string;
    role?: 'user' | 'guide' | 'lead-guide' | 'admin';
    password: string;
    passwordConfirm: string;
    passwordChangedAt?: Date,
    emailVerified?: boolean,
    redirectedTo?: string
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
    photo: {
        type: String,
        default: 'default.png'
    },
    photoId: {
        type: String
    },
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
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (ele) {
                return ele === this.password;
            },
            message: 'passwords don\'t match'
        },
    },
    passwordChangedAt: Date ,

    PasswordResetToken: String,

    passwordResetExpires: Date,

    isActive: {
        type: Boolean,
        default: true,
        select: false
    },

    welcomeToken: String,
    
    welcomeTokenExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false,
    }

})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined as unknown as string;
    next();

})

userSchema.pre('save', function (next){
    if (!this.isModified('password') || this.isNew)  return next()

    this.passwordChangedAt = new Date (Date.now() - 1000)
    next()

})

userSchema.pre(/^find/, function(this: Query<any, any>, next) {
    this.find({ isActive: { $ne: false } })
    next()
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

userSchema.methods.createPasswordRestetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex'); 

    this.PasswordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000   // 10 minutes

    return resetToken;

}
userSchema.methods.createWelcomeToken = function(){
    const token = crypto.randomBytes(32).toString('hex'); 

    this.welcomeToken = crypto.createHash('sha256').update(token).digest('hex');

    this.welcomeTokenExpires = Date.now() + 6 * 60 * 60 * 1000  // 6 hours

    return token;

}



export const User = mongoose.model<IUser>('User', userSchema)