import jwt, { SignOptions } from "jsonwebtoken"
import { AppError } from "./appError";
import mongoose from "mongoose";

interface payloadDate {
    id: mongoose.Types.ObjectId
}
export const signToken = (payload: payloadDate) => {
    const {JWT_EXPIRESIN, JWT_SECRET} = process.env;
    if (!JWT_SECRET || ! JWT_EXPIRESIN){
        throw new AppError('JWT env variables are not defined', 500)
    }
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRESIN
    }as SignOptions)
}