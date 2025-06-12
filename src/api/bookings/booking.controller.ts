import { Request, Response, NextFunction, json } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import * as tourServices from '../tours/tour.services'
import * as bookingServices from './booking.services'
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../../../config.env') })
import { Types } from 'mongoose'


const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined in config.env');
}
const stripe = new Stripe(stripeSecretKey);



export const getCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourServices.getOneById(req.params.tourId)
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour?.name} Tour`,
                        description: tour?.summary,
                        images: tour?.images
                    },
                    unit_amount: tour?.price! * 100,
                }
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/tours/?tour=${req.params.tourId}&user=${req.user?.id}&price=${tour?.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour?._id}`,
        client_reference_id: req.params.tourId,
        customer_email: req.user?.email,

    })
    res.status(200).json({
        status: 'success',
        session
    })

})





import * as factory from '../../utils/handlerFactory'

export const getAllBookings = factory.getAll('booking')

export const addBooking = factory.createOne('booking')

export const getBooking = factory.getOne('booking')

export const updateBooking = factory.updateOne('booking')

export const deleteBooking = factory.deleteOne('booking')

