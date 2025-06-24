import jwt, { SignOptions, JwtPayload, } from "jsonwebtoken"
import { AppError } from "./appError";
import mongoose from "mongoose";
import { promisify } from "util";
import { CustomError } from "../types/errorResponse";

interface payloadDate {
  id: mongoose.Types.ObjectId | string
}
export const signToken = (payload: payloadDate) => {
  const { JWT_EXPIRESIN, JWT_SECRET } = process.env;
  if (!JWT_SECRET || !JWT_EXPIRESIN) {
    throw new AppError('JWT env variables are not defined', 500)
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRESIN
  } as SignOptions)
}
export const generateRefreshToken = (payload: payloadDate) => {
  const { JWT_REFRESH_EXPIRESIN, JWT_REFRESH_SECRET } = process.env;
  if (!JWT_REFRESH_SECRET || !JWT_REFRESH_EXPIRESIN) {
    throw new AppError('JWT env variables are not defined', 500)
  }
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRESIN
  } as SignOptions)
}

const verify = promisify(jwt.verify) as (token: string, secret: string) => Promise<JwtPayload>;

export const verifySignToken = async (token: string): Promise<JwtPayload> => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) {
    throw new AppError('JWT env variables are not defined', 500)
  }
    const decoded = await verify(token, JWT_SECRET);
    return decoded
}
export const verifyRefreshToken = async (token: string): Promise<JwtPayload > => {
  const { JWT_REFRESH_SECRET } = process.env;
  if (!JWT_REFRESH_SECRET) {
    throw new AppError('JWT env variables are not defined', 500)
  }
    const decoded = await verify(token, JWT_REFRESH_SECRET);
    return decoded
}