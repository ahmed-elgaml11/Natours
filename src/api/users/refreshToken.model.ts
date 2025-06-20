import mongoose, { Schema, Document } from 'mongoose';

interface IRefreshToken extends Document {
    user: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
