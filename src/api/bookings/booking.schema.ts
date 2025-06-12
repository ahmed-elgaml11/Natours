import z from 'zod'
import { Types } from 'mongoose'

const objectIdString = z.string().refine(val => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId for tour or user',
});




export const bookingBodySchema = z.object({
  tour: z.string().min(1, 'Tour ID is required'),
  user: z.string().min(1, 'User ID is required'),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number'
  }),
  createdAt: z.date().optional(),
  paid: z.boolean().optional()
}).strict();


export const createBookingSchema = z.object({
  body: bookingBodySchema,
  params: z.object({})
}).strict();


export const getTourBookingSchema = z.object({
  body: z.object({}),
  params: z.object({
    tourId: objectIdString
  })
}).strict();

export const getBookingSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: objectIdString
  })
}).strict();


export const updateBookingSchema = z.object({
  body: bookingBodySchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field is required for update',
    }
  ),
  params: z.object({
    id: objectIdString
  })
});
