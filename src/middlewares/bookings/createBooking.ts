import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Types } from 'mongoose';
import * as bookingServices from '../../api/bookings/booking.services'
export const createBookingCheckout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    const tourId = new Types.ObjectId(tour as string);
    const userId = new Types.ObjectId(user as string);
    const parsedPrice = Number(price);


    await bookingServices.createOne({ tour: tourId, user: userId, price: parsedPrice })

    res.redirect(req.originalUrl.split('?')[0]);

})

