import jwt, { SignOptions, JwtPayload,  } from "jsonwebtoken"
import { AppError } from "./appError";
import mongoose from "mongoose";
import { promisify } from "util";
import { string, unknown } from "zod";

interface payloadDate {
  id: mongoose.Types.ObjectId
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

const verify = promisify(jwt.verify) as (token: string, secret: string) => Promise<JwtPayload>;

export const verifyToken = async (token: string ) : Promise<JwtPayload> => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) {
    throw new AppError('JWT env variables are not defined', 500)
  }
  const decoded = await verify(token, JWT_SECRET);
  return decoded
}