import mongoose from "mongoose";
const schema = mongoose.Schema
export interface IReview extends Document {
    review: string;
    rating: number;
    createdAt: Date;
    tour: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
}
const reiewSchema = new schema<IReview>({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Review = mongoose.model<IReview>('Review', reiewSchema)
