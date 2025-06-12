import mongoose from "mongoose";
import { Query } from "mongoose";
import { Types } from 'mongoose';

export interface IBooking {
  tour: Types.ObjectId;
  user: Types.ObjectId;
  price: number;
  createdAt?: Date;
  paid?: boolean;
}
const bookingSchema = new mongoose.Schema<IBooking>({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
    },
    price: {
        type: Number,
        require: [true, 'Booking must have a price.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre(/^find/, function (this: Query<any, any> , next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });
    next();
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

